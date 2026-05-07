"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseCommaSeparated, parseLines, slugify, toCommaSeparated, toLines } from "@/lib/format";
import type {
  ContactMethod,
  HighlightCard,
  HomeLead,
  LinkAction,
  Member,
  PageHero,
  RecordGroup,
  RecruitmentSkillCard,
  ResearchItem,
  SiteData,
  TimelineItem,
} from "@/types/site";

type AdminDashboardProps = {
  initialData: SiteData;
  archiveMessage?: string;
};

type StatusTone = "neutral" | "success" | "error";
type AdminTabKey =
  | "site"
  | "home"
  | "about"
  | "news"
  | "members"
  | "research"
  | "publications"
  | "recruitment"
  | "contact";

const TABS: Array<{ key: AdminTabKey; label: string }> = [
  { key: "site", label: "全局配置" },
  { key: "home", label: "首页" },
  { key: "about", label: "关于" },
  { key: "news", label: "新闻" },
  { key: "members", label: "成员" },
  { key: "research", label: "研究内容" },
  { key: "publications", label: "出版物" },
  { key: "recruitment", label: "招募" },
  { key: "contact", label: "联系方式" },
];

const PREVIEW_OPTIONS = [
  { label: "首页", href: "/" },
  { label: "关于", href: "/about" },
  { label: "新闻", href: "/news" },
  { label: "新闻归档", href: "/news/archive" },
  { label: "成员", href: "/members" },
  { label: "研究内容", href: "/research" },
  { label: "出版物", href: "/publications" },
  { label: "招募", href: "/recruitment" },
  { label: "联系方式", href: "/contact" },
];

const cloneData = (value: SiteData) => structuredClone(value);

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;

const moveItem = <T,>(items: T[], index: number, direction: -1 | 1) => {
  const target = index + direction;

  if (target < 0 || target >= items.length) {
    return items;
  }

  const next = [...items];
  const [current] = next.splice(index, 1);
  next.splice(target, 0, current);
  return next;
};

const defaultLinkAction = (): LinkAction => ({
  label: "",
  href: "",
});

const defaultHighlight = (prefix: string): HighlightCard => ({
  id: createId(prefix),
  title: "",
  value: "",
  caption: "",
});

const defaultTimelineItem = (): TimelineItem => ({
  id: createId("timeline"),
  date: "",
  title: "",
  description: "",
  image: "/graphics/placeholder.svg",
});

const defaultNewsItem = () => ({
  id: createId("news"),
  slug: "",
  label: "",
  title: "",
  date: "",
  summary: "",
  content: [],
  image: "/graphics/placeholder.svg",
  relatedLink: "",
  pinned: false,
  visible: true,
});

const defaultMember = (): Member => ({
  id: createId("member"),
  slug: "",
  name: "",
  title: "",
  image: "/graphics/placeholder.svg",
  birthDate: "",
  hometown: "",
  researchAreas: [],
  email: "",
  phone: "",
  profileLink: "",
  summary: "",
  visible: true,
});

const defaultResearchItem = (prefix: string): ResearchItem => ({
  id: createId(prefix),
  title: "",
  summary: "",
  tags: [],
  image: "/graphics/placeholder.svg",
  link: "",
  visible: true,
});

const defaultRecordItem = (prefix: string) => ({
  id: createId(prefix),
  title: "",
  subtitle: "",
  meta: "",
  summary: "",
  link: "",
  visible: true,
});

const defaultRecruitmentSkillCard = (): RecruitmentSkillCard => ({
  id: createId("recruitment-growth"),
  title: "",
  items: [],
});

const defaultRecruitmentCard = () => ({
  id: createId("recruitment"),
  title: "",
  content: "",
  linkLabel: "",
  href: "",
});

const defaultContactMethod = (): ContactMethod => ({
  id: createId("contact"),
  label: "",
  value: "",
  note: "",
});

function PanelCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="admin-panel-card">
      <div className="admin-panel-card__head">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "date" | "number" | "password";
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <input
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <textarea onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={rows} value={value} />
    </label>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="admin-toggle">
      <input checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" />
      <span>{label}</span>
    </label>
  );
}

function UploadField({
  value,
  onChange,
  folder,
}: {
  value: string;
  onChange: (value: string) => void;
  folder: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async (file: File | undefined) => {
    if (!file) {
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as { ok: boolean; path?: string; message?: string };

      if (!response.ok || !result.ok || !result.path) {
        setMessage(result.message ?? "上传失败");
        return;
      }

      onChange(result.path);
      setMessage("上传完成");
    } catch (error) {
      console.error(error);
      setMessage("上传失败");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-upload">
      <input onChange={(event) => onChange(event.target.value)} value={value} />
      <label className="admin-upload__button">
        <input hidden onChange={(event) => handleUpload(event.target.files?.[0])} type="file" />
        {uploading ? "上传中..." : "上传"}
      </label>
      {message ? <small>{message}</small> : null}
    </div>
  );
}

function RowActions({
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="admin-row-actions">
      <button onClick={onMoveUp} type="button">
        上移
      </button>
      <button onClick={onMoveDown} type="button">
        下移
      </button>
      <button className="is-danger" onClick={onDelete} type="button">
        删除
      </button>
    </div>
  );
}

function HeroEditor({
  hero,
  onChange,
}: {
  hero: PageHero;
  onChange: (next: PageHero) => void;
}) {
  return (
    <div className="admin-field-grid">
      <Field label="短标题" onChange={(value) => onChange({ ...hero, eyebrow: value })} value={hero.eyebrow} />
      <Field label="标题" onChange={(value) => onChange({ ...hero, title: value })} value={hero.title} />
      <Field label="副标题" onChange={(value) => onChange({ ...hero, subtitle: value })} value={hero.subtitle} />
      <TextAreaField
        label="描述"
        onChange={(value) => onChange({ ...hero, description: value })}
        rows={3}
        value={hero.description}
      />
      <ActionEditor
        action={hero.primaryAction ?? defaultLinkAction()}
        label="主按钮"
        onChange={(value) => onChange({ ...hero, primaryAction: value })}
      />
      <ActionEditor
        action={hero.secondaryAction ?? defaultLinkAction()}
        label="次按钮"
        onChange={(value) => onChange({ ...hero, secondaryAction: value })}
      />
    </div>
  );
}

function ActionEditor({
  label,
  action,
  onChange,
}: {
  label: string;
  action: LinkAction;
  onChange: (next: LinkAction) => void;
}) {
  return (
    <div className="admin-inline-grid">
      <Field label={`${label}文案`} onChange={(value) => onChange({ ...action, label: value })} value={action.label} />
      <Field label={`${label}链接`} onChange={(value) => onChange({ ...action, href: value })} value={action.href} />
    </div>
  );
}

function LeadEditor({
  label,
  lead,
  onChange,
}: {
  label: string;
  lead: HomeLead;
  onChange: (next: HomeLead) => void;
}) {
  return (
    <div className="admin-field-grid">
      <Field label={`${label}标题`} onChange={(value) => onChange({ ...lead, title: value })} value={lead.title} />
      <Field
        label={`${label}按钮文案`}
        onChange={(value) => onChange({ ...lead, buttonLabel: value })}
        value={lead.buttonLabel}
      />
      <Field label={`${label}跳转链接`} onChange={(value) => onChange({ ...lead, href: value })} value={lead.href} />
      <TextAreaField
        label={`${label}描述`}
        onChange={(value) => onChange({ ...lead, description: value })}
        rows={2}
        value={lead.description}
      />
    </div>
  );
}

export function AdminDashboard({ initialData, archiveMessage }: AdminDashboardProps) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState<AdminTabKey>("site");
  const [previewPath, setPreviewPath] = useState("/");
  const [previewSeed, setPreviewSeed] = useState(0);
  const [status, setStatus] = useState(archiveMessage ?? "在右侧修改字段，点击保存后写入本地 JSON 文件。");
  const [statusTone, setStatusTone] = useState<StatusTone>("neutral");
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const updateData = (mutator: (draft: SiteData) => void) => {
    setData((current) => {
      const next = cloneData(current);
      mutator(next);
      return next;
    });
  };

  const saveData = async () => {
    setSaving(true);
    setStatusTone("neutral");
    setStatus("正在保存...");

    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });
      const result = (await response.json()) as {
        ok: boolean;
        data?: SiteData;
        message?: string;
        archivedCount?: number;
      };

      if (!response.ok || !result.ok || !result.data) {
        setStatus(result.message ?? "保存失败");
        setStatusTone("error");
        return;
      }

      setData(result.data);
      setPreviewSeed(Date.now());
      setStatusTone("success");
      setStatus(
        result.archivedCount
          ? `保存完成，已归档 ${result.archivedCount} 条新闻。`
          : "保存完成，内容已写入本地 JSON 文件。",
      );
    } catch (error) {
      console.error(error);
      setStatus("保存失败，请稍后重试。");
      setStatusTone("error");
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    setLoggingOut(true);

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  const openPreviewPage = () => {
    router.push(previewPath);
    router.refresh();
  };

  const previewSrc = `${previewPath}${previewPath.includes("?") ? "&" : "?"}preview=${previewSeed}`;

  return (
    <div className="admin-shell">
      <aside className="admin-rail">
        <div className="admin-rail__panel">
          <p className="section-heading__eyebrow">Content Studio</p>
          <h1>实验室后台</h1>
          <p>保存后写入本地文件，图片上传到服务器目录。</p>

          <nav className="admin-tab-list" aria-label="后台栏目">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={tab.key === activeTab ? "is-active" : ""}
                onClick={() => setActiveTab(tab.key)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <section className="admin-preview">
        <div className="admin-toolbar">
          <label className="admin-field">
            <span>预览页面</span>
            <select onChange={(event) => setPreviewPath(event.target.value)} value={previewPath}>
              {PREVIEW_OPTIONS.map((option) => (
                <option key={option.href} value={option.href}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="admin-toolbar__actions">
            <button className="button-link button-link--secondary" onClick={() => setPreviewSeed(Date.now())} type="button">
              刷新预览
            </button>
            <button className="button-link button-link--secondary" onClick={openPreviewPage} type="button">
              返回前台
            </button>
            <button className="button-link button-link--primary" disabled={saving} onClick={saveData} type="button">
              {saving ? "保存中..." : "保存全部"}
            </button>
            <button className="button-link button-link--secondary" disabled={loggingOut} onClick={logout} type="button">
              {loggingOut ? "退出中..." : "退出登录"}
            </button>
          </div>
        </div>

        <p className={`admin-status ${statusTone === "success" ? "is-success" : statusTone === "error" ? "is-error" : ""}`}>
          {status}
        </p>

        <div className="admin-preview__frame">
          <iframe key={previewSeed} src={previewSrc} title="站点预览" />
        </div>
      </section>

      <aside className="admin-editor">
        <div className="admin-editor__inner">
          {activeTab === "site" ? <SiteSettingsEditor data={data} updateData={updateData} /> : null}
          {activeTab === "home" ? <HomeEditor data={data} updateData={updateData} /> : null}
          {activeTab === "about" ? <AboutEditor data={data} updateData={updateData} /> : null}
          {activeTab === "news" ? <NewsEditor data={data} updateData={updateData} /> : null}
          {activeTab === "members" ? <MembersEditorPanel data={data} updateData={updateData} /> : null}
          {activeTab === "research" ? <ResearchEditor data={data} updateData={updateData} /> : null}
          {activeTab === "publications" ? <RecordGroupsEditor data={data} groupType="publications" updateData={updateData} /> : null}
          {activeTab === "recruitment" ? <RecruitmentEditorV3 data={data} updateData={updateData} /> : null}
          {activeTab === "contact" ? <ContactEditorV2 data={data} updateData={updateData} /> : null}
        </div>
      </aside>
    </div>
  );
}

function SiteSettingsEditor({
  data,
  updateData,
}: {
  data: SiteData;
  updateData: (mutator: (draft: SiteData) => void) => void;
}) {
  return (
    <>
      <PanelCard title="站点配置" description="实验室名称、页脚文案与新闻归档阈值。">
        <div className="admin-field-grid">
          <Field
            label="实验室名称"
            onChange={(value) => updateData((draft) => void (draft.settings.labName = value))}
            value={data.settings.labName}
          />
          <Field
            label="简称"
            onChange={(value) => updateData((draft) => void (draft.settings.shortName = value))}
            value={data.settings.shortName}
          />
          <Field
            label="后台按钮文案"
            onChange={(value) => updateData((draft) => void (draft.settings.adminLabel = value))}
            value={data.settings.adminLabel}
          />
          <Field
            label="新闻归档月数"
            onChange={(value) => updateData((draft) => void (draft.settings.newsArchiveMonths = Number(value) || 1))}
            type="number"
            value={data.settings.newsArchiveMonths}
          />
          <Field
            label="最少保留新闻条数"
            onChange={(value) => updateData((draft) => void (draft.settings.minimumNewsItems = Number(value) || 0))}
            type="number"
            value={data.settings.minimumNewsItems}
          />
          <TextAreaField
            label="站点描述"
            onChange={(value) => updateData((draft) => void (draft.settings.description = value))}
            rows={2}
            value={data.settings.description}
          />
          <TextAreaField
            label="页脚附言"
            onChange={(value) => updateData((draft) => void (draft.settings.footerNote = value))}
            rows={2}
            value={data.settings.footerNote}
          />
        </div>
      </PanelCard>

      <PanelCard title="导航栏">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>标题</th>
                <th>链接</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {data.navigation.map((item, index) => (
                <tr key={`${item.href}-${index}`}>
                  <td>
                    <input
                      onChange={(event) =>
                        updateData((draft) => {
                          draft.navigation[index].label = event.target.value;
                        })
                      }
                      value={item.label}
                    />
                  </td>
                  <td>
                    <input
                      onChange={(event) =>
                        updateData((draft) => {
                          draft.navigation[index].href = event.target.value;
                        })
                      }
                      value={item.href}
                    />
                  </td>
                  <td>
                    <RowActions
                      onDelete={() =>
                        updateData((draft) => {
                          draft.navigation.splice(index, 1);
                        })
                      }
                      onMoveDown={() =>
                        updateData((draft) => {
                          draft.navigation = moveItem(draft.navigation, index, 1);
                        })
                      }
                      onMoveUp={() =>
                        updateData((draft) => {
                          draft.navigation = moveItem(draft.navigation, index, -1);
                        })
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          className="admin-add-button"
          onClick={() =>
            updateData((draft) => {
              draft.navigation.push({ label: "新栏目", href: "/new-page" });
            })
          }
          type="button"
        >
          新增导航项
        </button>
      </PanelCard>
    </>
  );
}

function HomeEditor({
  data,
  updateData,
}: {
  data: SiteData;
  updateData: (mutator: (draft: SiteData) => void) => void;
}) {
  return (
    <>
      <PanelCard title="首页首屏">
        <HeroEditor
          hero={data.home.hero}
          onChange={(next) =>
            updateData((draft) => {
              draft.home.hero = next;
            })
          }
        />
      </PanelCard>

      <PanelCard title="首页活动滚动条目">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>日期</th>
                <th>标签</th>
                <th>标题</th>
                <th>摘要</th>
                <th>跳转链接</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {data.home.activities.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    <input
                      onChange={(event) =>
                        updateData((draft) => {
                          draft.home.activities[index].date = event.target.value;
                        })
                      }
                      type="date"
                      value={item.date}
                    />
                  </td>
                  <td>
                    <input
                      onChange={(event) =>
                        updateData((draft) => {
                          draft.home.activities[index].label = event.target.value;
                        })
                      }
                      value={item.label}
                    />
                  </td>
                  <td>
                    <textarea
                      onChange={(event) =>
                        updateData((draft) => {
                          draft.home.activities[index].title = event.target.value;
                        })
                      }
                      rows={2}
                      value={item.title}
                    />
                  </td>
                  <td>
                    <textarea
                      onChange={(event) =>
                        updateData((draft) => {
                          draft.home.activities[index].summary = event.target.value;
                        })
                      }
                      rows={3}
                      value={item.summary}
                    />
                  </td>
                  <td>
                    <input
                      onChange={(event) =>
                        updateData((draft) => {
                          draft.home.activities[index].href = event.target.value;
                        })
                      }
                      value={item.href}
                    />
                  </td>
                  <td>
                    <RowActions
                      onDelete={() =>
                        updateData((draft) => {
                          draft.home.activities.splice(index, 1);
                        })
                      }
                      onMoveDown={() =>
                        updateData((draft) => {
                          draft.home.activities = moveItem(draft.home.activities, index, 1);
                        })
                      }
                      onMoveUp={() =>
                        updateData((draft) => {
                          draft.home.activities = moveItem(draft.home.activities, index, -1);
                        })
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          className="admin-add-button"
          onClick={() =>
            updateData((draft) => {
              draft.home.activities.push({
                id: createId("activity"),
                date: "",
                label: "",
                title: "",
                summary: "",
                href: "/news",
              });
            })
          }
          type="button"
        >
          新增活动条目
        </button>
      </PanelCard>

      <PanelCard title="首页下方简短区块">
        <LeadEditor
          label="实验室概览"
          lead={data.home.intro}
          onChange={(next) =>
            updateData((draft) => {
              draft.home.intro = next;
            })
          }
        />
        <TextAreaField
          label="实验室概览正文（每行一段）"
          onChange={(value) =>
            updateData((draft) => {
              draft.home.intro.content = parseLines(value);
            })
          }
          rows={5}
          value={toLines(data.home.intro.content ?? [])}
        />
        <LeadEditor
          label="新闻简介"
          lead={data.home.newsLead}
          onChange={(next) =>
            updateData((draft) => {
              draft.home.newsLead = next;
            })
          }
        />
        <LeadEditor
          label="成员简介"
          lead={data.home.membersLead}
          onChange={(next) =>
            updateData((draft) => {
              draft.home.membersLead = next;
            })
          }
        />
        <LeadEditor
          label="招募简介"
          lead={data.home.recruitmentLead}
          onChange={(next) =>
            updateData((draft) => {
              draft.home.recruitmentLead = next;
            })
          }
        />
      </PanelCard>
    </>
  );
}

function AboutEditor({
  data,
  updateData,
}: {
  data: SiteData;
  updateData: (mutator: (draft: SiteData) => void) => void;
}) {
  return (
    <>
      <PanelCard title="关于页首屏">
        <HeroEditor
          hero={data.about.hero}
          onChange={(next) =>
            updateData((draft) => {
              draft.about.hero = next;
            })
          }
        />
      </PanelCard>

      <PanelCard title="实验室介绍">
        <div className="admin-field-grid">
          <Field
            label="标题"
            onChange={(value) => updateData((draft) => void (draft.about.introTitle = value))}
            value={data.about.introTitle}
          />
          <TextAreaField
            label="正文（每行一段）"
            onChange={(value) => updateData((draft) => void (draft.about.introText = parseLines(value)))}
            rows={6}
            value={toLines(data.about.introText)}
          />
          <Field
            label="配图说明"
            onChange={(value) => updateData((draft) => void (draft.about.introImageAlt = value))}
                value={data.about.introImageAlt ?? ""}
          />
          <UploadField
            folder="about"
            onChange={(value) => updateData((draft) => void (draft.about.introImage = value))}
            value={data.about.introImage}
          />
        </div>

        <HighlightsTable
          title="亮点卡片"
          items={data.about.introHighlights}
          onAdd={() =>
            updateData((draft) => {
              draft.about.introHighlights.push(defaultHighlight("about-highlight"));
            })
          }
          onChange={(index, key, value) =>
            updateData((draft) => {
              draft.about.introHighlights[index][key] = value;
            })
          }
          onDelete={(index) =>
            updateData((draft) => {
              draft.about.introHighlights.splice(index, 1);
            })
          }
          onMove={(index, direction) =>
            updateData((draft) => {
              draft.about.introHighlights = moveItem(draft.about.introHighlights, index, direction);
            })
          }
        />
      </PanelCard>

      <PanelCard title="发展经历">
        <div className="admin-field-grid">
          <Field
            label="时间线标题"
            onChange={(value) => updateData((draft) => void (draft.about.timelineTitle = value))}
            value={data.about.timelineTitle}
          />
          <TextAreaField
            label="时间线说明"
            onChange={(value) => updateData((draft) => void (draft.about.timelineSubtitle = value))}
            rows={2}
            value={data.about.timelineSubtitle}
          />
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>时间</th>
                <th>标题</th>
                <th>说明</th>
                <th>图片</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {data.about.timeline.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    <input
                      onChange={(event) =>
                        updateData((draft) => {
                          draft.about.timeline[index].date = event.target.value;
                        })
                      }
                      value={item.date}
                    />
                  </td>
                  <td>
                    <input
                      onChange={(event) =>
                        updateData((draft) => {
                          draft.about.timeline[index].title = event.target.value;
                        })
                      }
                      value={item.title}
                    />
                  </td>
                  <td>
                    <textarea
                      onChange={(event) =>
                        updateData((draft) => {
                          draft.about.timeline[index].description = event.target.value;
                        })
                      }
                      rows={3}
                      value={item.description}
                    />
                  </td>
                  <td>
                    <UploadField
                      folder="timeline"
                      onChange={(value) =>
                        updateData((draft) => {
                          draft.about.timeline[index].image = value;
                        })
                      }
                      value={item.image}
                    />
                  </td>
                  <td>
                    <RowActions
                      onDelete={() =>
                        updateData((draft) => {
                          draft.about.timeline.splice(index, 1);
                        })
                      }
                      onMoveDown={() =>
                        updateData((draft) => {
                          draft.about.timeline = moveItem(draft.about.timeline, index, 1);
                        })
                      }
                      onMoveUp={() =>
                        updateData((draft) => {
                          draft.about.timeline = moveItem(draft.about.timeline, index, -1);
                        })
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          className="admin-add-button"
          onClick={() =>
            updateData((draft) => {
              draft.about.timeline.push(defaultTimelineItem());
            })
          }
          type="button"
        >
          新增时间线节点
        </button>
      </PanelCard>

      <PanelCard title="发展目标">
        <div className="admin-field-grid">
          <Field
            label="标题"
            onChange={(value) => updateData((draft) => void (draft.about.goalsTitle = value))}
            value={data.about.goalsTitle}
          />
          <TextAreaField
            label="主陈述"
            onChange={(value) => updateData((draft) => void (draft.about.goalsStatement = value))}
            rows={2}
            value={data.about.goalsStatement}
          />
          <TextAreaField
            label="正文（每行一段）"
            onChange={(value) => updateData((draft) => void (draft.about.goalsText = parseLines(value)))}
            rows={5}
            value={toLines(data.about.goalsText)}
          />
        </div>

        <HighlightsTable
          title="目标卡片"
          items={data.about.goalsCards}
          onAdd={() =>
            updateData((draft) => {
              draft.about.goalsCards.push(defaultHighlight("goal-card"));
            })
          }
          onChange={(index, key, value) =>
            updateData((draft) => {
              draft.about.goalsCards[index][key] = value;
            })
          }
          onDelete={(index) =>
            updateData((draft) => {
              draft.about.goalsCards.splice(index, 1);
            })
          }
          onMove={(index, direction) =>
            updateData((draft) => {
              draft.about.goalsCards = moveItem(draft.about.goalsCards, index, direction);
            })
          }
        />
      </PanelCard>
    </>
  );
}

function NewsEditor({
  data,
  updateData,
}: {
  data: SiteData;
  updateData: (mutator: (draft: SiteData) => void) => void;
}) {
  return (
    <>
      <PanelCard title="新闻页首屏">
        <HeroEditor
          hero={data.news.hero}
          onChange={(next) =>
            updateData((draft) => {
              draft.news.hero = next;
            })
          }
        />
      </PanelCard>

      <PanelCard title="归档页配置" description={`当前已归档 ${data.news.archivedItems.length} 条新闻。`}>
        <div className="admin-field-grid">
          <Field
            label="归档页标题"
            onChange={(value) => updateData((draft) => void (draft.news.archiveTitle = value))}
            value={data.news.archiveTitle}
          />
          <TextAreaField
            label="归档页说明"
            onChange={(value) => updateData((draft) => void (draft.news.archiveSubtitle = value))}
            rows={2}
            value={data.news.archiveSubtitle}
          />
        </div>
      </PanelCard>

      <PanelCard title="新闻条目表格">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>标签</th>
                <th>标题</th>
                <th>Slug</th>
                <th>日期</th>
                <th>摘要</th>
                <th>正文（每行一段）</th>
                <th>图片</th>
                <th>相关链接</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {data.news.items.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    <input
                      onChange={(event) =>
                        updateData((draft) => {
                          draft.news.items[index].label = event.target.value;
                        })
                      }
                      value={item.label}
                    />
                  </td>
                  <td>
                    <textarea
                      onChange={(event) =>
                        updateData((draft) => {
                          draft.news.items[index].title = event.target.value;
                          if (!draft.news.items[index].slug) {
                            draft.news.items[index].slug = slugify(event.target.value);
                          }
                        })
                      }
                      rows={2}
                      value={item.title}
                    />
                  </td>
                  <td>
                    <input
                      onChange={(event) =>
                        updateData((draft) => {
                          draft.news.items[index].slug = event.target.value;
                        })
                      }
                      value={item.slug}
                    />
                  </td>
                  <td>
                    <input
                      onChange={(event) =>
                        updateData((draft) => {
                          draft.news.items[index].date = event.target.value;
                        })
                      }
                      type="date"
                      value={item.date}
                    />
                  </td>
                  <td>
                    <textarea
                      onChange={(event) =>
                        updateData((draft) => {
                          draft.news.items[index].summary = event.target.value;
                        })
                      }
                      rows={3}
                      value={item.summary}
                    />
                  </td>
                  <td>
                    <textarea
                      onChange={(event) =>
                        updateData((draft) => {
                          draft.news.items[index].content = parseLines(event.target.value);
                        })
                      }
                      rows={5}
                      value={toLines(item.content)}
                    />
                  </td>
                  <td>
                    <UploadField
                      folder="news"
                      onChange={(value) =>
                        updateData((draft) => {
                          draft.news.items[index].image = value;
                        })
                      }
                      value={item.image}
                    />
                  </td>
                  <td>
                    <input
                      onChange={(event) =>
                        updateData((draft) => {
                          draft.news.items[index].relatedLink = event.target.value;
                        })
                      }
                      value={item.relatedLink ?? ""}
                    />
                  </td>
                  <td>
                    <ToggleField
                      checked={item.pinned}
                      label="置顶"
                      onChange={(checked) =>
                        updateData((draft) => {
                          draft.news.items[index].pinned = checked;
                        })
                      }
                    />
                    <ToggleField
                      checked={item.visible}
                      label="显示"
                      onChange={(checked) =>
                        updateData((draft) => {
                          draft.news.items[index].visible = checked;
                        })
                      }
                    />
                  </td>
                  <td>
                    <RowActions
                      onDelete={() =>
                        updateData((draft) => {
                          draft.news.items.splice(index, 1);
                        })
                      }
                      onMoveDown={() =>
                        updateData((draft) => {
                          draft.news.items = moveItem(draft.news.items, index, 1);
                        })
                      }
                      onMoveUp={() =>
                        updateData((draft) => {
                          draft.news.items = moveItem(draft.news.items, index, -1);
                        })
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          className="admin-add-button"
          onClick={() =>
            updateData((draft) => {
              draft.news.items.unshift(defaultNewsItem());
            })
          }
          type="button"
        >
          新增新闻
        </button>
      </PanelCard>
    </>
  );
}

function MembersEditor({
  data,
  updateData,
}: {
  data: SiteData;
  updateData: (mutator: (draft: SiteData) => void) => void;
}) {
  return (
    <>
      <PanelCard title="成员页首屏">
        <HeroEditor
          hero={data.members.hero}
          onChange={(next) =>
            updateData((draft) => {
              draft.members.hero = next;
            })
          }
        />
      </PanelCard>

      {data.members.groups.map((group, groupIndex) => (
        <PanelCard key={group.id} description="点击姓名会跳转到成员详情页。" title={group.title}>
          <Field
            label="分组标题"
            onChange={(value) =>
              updateData((draft) => {
                draft.members.groups[groupIndex].title = value;
              })
            }
            value={group.title}
          />

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>姓名</th>
                  <th>职位</th>
                  <th>Slug</th>
                  <th>头像</th>
                  <th>出生日期</th>
                  <th>籍贯</th>
                  <th>研究方向（逗号分隔）</th>
                  <th>邮箱</th>
                  <th>电话</th>
                  <th>展示链接</th>
                  <th>简介</th>
                  <th>显示</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {group.items.map((member, index) => (
                  <tr key={member.id}>
                    <td>
                      <input
                        onChange={(event) =>
                          updateData((draft) => {
                            draft.members.groups[groupIndex].items[index].name = event.target.value;
                            if (!draft.members.groups[groupIndex].items[index].slug) {
                              draft.members.groups[groupIndex].items[index].slug = slugify(event.target.value);
                            }
                          })
                        }
                        value={member.name}
                      />
                    </td>
                    <td>
                      <input
                        onChange={(event) =>
                          updateData((draft) => {
                            draft.members.groups[groupIndex].items[index].title = event.target.value;
                          })
                        }
                        value={member.title}
                      />
                    </td>
                    <td>
                      <input
                        onChange={(event) =>
                          updateData((draft) => {
                            draft.members.groups[groupIndex].items[index].slug = event.target.value;
                          })
                        }
                        value={member.slug}
                      />
                    </td>
                    <td>
                      <UploadField
                        folder="members"
                        onChange={(value) =>
                          updateData((draft) => {
                            draft.members.groups[groupIndex].items[index].image = value;
                          })
                        }
                        value={member.image}
                      />
                    </td>
                    <td>
                      <input
                        onChange={(event) =>
                          updateData((draft) => {
                            draft.members.groups[groupIndex].items[index].birthDate = event.target.value;
                          })
                        }
                        type="date"
                        value={member.birthDate ?? ""}
                      />
                    </td>
                    <td>
                      <input
                        onChange={(event) =>
                          updateData((draft) => {
                            draft.members.groups[groupIndex].items[index].hometown = event.target.value;
                          })
                        }
                        value={member.hometown ?? ""}
                      />
                    </td>
                    <td>
                      <textarea
                        onChange={(event) =>
                          updateData((draft) => {
                            draft.members.groups[groupIndex].items[index].researchAreas = parseCommaSeparated(event.target.value);
                          })
                        }
                        rows={3}
                        value={toCommaSeparated(member.researchAreas)}
                      />
                    </td>
                    <td>
                      <input
                        onChange={(event) =>
                          updateData((draft) => {
                            draft.members.groups[groupIndex].items[index].email = event.target.value;
                          })
                        }
                        value={member.email}
                      />
                    </td>
                    <td>
                      <input
                        onChange={(event) =>
                          updateData((draft) => {
                            draft.members.groups[groupIndex].items[index].phone = event.target.value;
                          })
                        }
                        value={member.phone ?? ""}
                      />
                    </td>
                    <td>
                      <input
                        onChange={(event) =>
                          updateData((draft) => {
                            draft.members.groups[groupIndex].items[index].profileLink = event.target.value;
                          })
                        }
                        value={member.profileLink ?? ""}
                      />
                    </td>
                    <td>
                      <textarea
                        onChange={(event) =>
                          updateData((draft) => {
                            draft.members.groups[groupIndex].items[index].summary = event.target.value;
                          })
                        }
                        rows={4}
                        value={member.summary}
                      />
                    </td>
                    <td>
                      <ToggleField
                        checked={member.visible}
                        label="显示"
                        onChange={(checked) =>
                          updateData((draft) => {
                            draft.members.groups[groupIndex].items[index].visible = checked;
                          })
                        }
                      />
                    </td>
                    <td>
                      <RowActions
                        onDelete={() =>
                          updateData((draft) => {
                            draft.members.groups[groupIndex].items.splice(index, 1);
                          })
                        }
                        onMoveDown={() =>
                          updateData((draft) => {
                            draft.members.groups[groupIndex].items = moveItem(draft.members.groups[groupIndex].items, index, 1);
                          })
                        }
                        onMoveUp={() =>
                          updateData((draft) => {
                            draft.members.groups[groupIndex].items = moveItem(draft.members.groups[groupIndex].items, index, -1);
                          })
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            className="admin-add-button"
            onClick={() =>
              updateData((draft) => {
                draft.members.groups[groupIndex].items.push(defaultMember());
              })
            }
            type="button"
          >
            新增成员
          </button>
        </PanelCard>
      ))}
    </>
  );
}

function MembersEditorPanel({
  data,
  updateData,
}: {
  data: SiteData;
  updateData: (mutator: (draft: SiteData) => void) => void;
}) {
  return (
    <>
      <PanelCard title="成员页首屏">
        <HeroEditor
          hero={data.members.hero}
          onChange={(next) =>
            updateData((draft) => {
              draft.members.hero = next;
            })
          }
        />
      </PanelCard>

      {data.members.groups.map((group, groupIndex) => (
        <PanelCard key={group.id} description="点击姓名会跳转到成员详情页。" title={group.title}>
          <div className="admin-member-group__header">
            <div className="admin-member-group__title">
              <Field
                label="分组标题"
                onChange={(value) =>
                  updateData((draft) => {
                    draft.members.groups[groupIndex].title = value;
                  })
                }
                value={group.title}
              />
            </div>

            <button
              className="admin-add-button"
              onClick={() =>
                updateData((draft) => {
                  draft.members.groups[groupIndex].items.push(defaultMember());
                })
              }
              type="button"
            >
              新增成员
            </button>
          </div>

          <div className="admin-member-list">
            {group.items.map((member, index) => (
              <article key={member.id} className="admin-member-card">
                <div className="admin-member-card__header">
                  <div className="admin-member-card__meta">
                    <p>{`成员 ${String(index + 1).padStart(2, "0")}`}</p>
                    <h3>{member.name || "未命名成员"}</h3>
                    <span>{member.title || "请填写职位"}</span>
                  </div>

                  <div className="admin-member-card__controls">
                    <ToggleField
                      checked={member.visible}
                      label="显示"
                      onChange={(checked) =>
                        updateData((draft) => {
                          draft.members.groups[groupIndex].items[index].visible = checked;
                        })
                      }
                    />
                    <RowActions
                      onDelete={() =>
                        updateData((draft) => {
                          draft.members.groups[groupIndex].items.splice(index, 1);
                        })
                      }
                      onMoveDown={() =>
                        updateData((draft) => {
                          draft.members.groups[groupIndex].items = moveItem(draft.members.groups[groupIndex].items, index, 1);
                        })
                      }
                      onMoveUp={() =>
                        updateData((draft) => {
                          draft.members.groups[groupIndex].items = moveItem(draft.members.groups[groupIndex].items, index, -1);
                        })
                      }
                    />
                  </div>
                </div>

                <div className="admin-member-card__grid">
                  <Field
                    label="姓名"
                    onChange={(value) =>
                      updateData((draft) => {
                        draft.members.groups[groupIndex].items[index].name = value;
                        if (!draft.members.groups[groupIndex].items[index].slug) {
                          draft.members.groups[groupIndex].items[index].slug = slugify(value);
                        }
                      })
                    }
                    value={member.name}
                  />
                  <Field
                    label="职位"
                    onChange={(value) =>
                      updateData((draft) => {
                        draft.members.groups[groupIndex].items[index].title = value;
                      })
                    }
                    value={member.title}
                  />
                  <div className="admin-field">
                    <span>头像</span>
                    <UploadField
                      folder="members"
                      onChange={(value) =>
                        updateData((draft) => {
                          draft.members.groups[groupIndex].items[index].image = value;
                        })
                      }
                      value={member.image}
                    />
                  </div>
                  <Field
                    label="出生日期"
                    onChange={(value) =>
                      updateData((draft) => {
                        draft.members.groups[groupIndex].items[index].birthDate = value;
                      })
                    }
                    type="date"
                    value={member.birthDate ?? ""}
                  />
                  <Field
                    label="籍贯"
                    onChange={(value) =>
                      updateData((draft) => {
                        draft.members.groups[groupIndex].items[index].hometown = value;
                      })
                    }
                    value={member.hometown ?? ""}
                  />
                  <Field
                    label="邮箱"
                    onChange={(value) =>
                      updateData((draft) => {
                        draft.members.groups[groupIndex].items[index].email = value;
                      })
                    }
                    value={member.email}
                  />
                  <Field
                    label="电话"
                    onChange={(value) =>
                      updateData((draft) => {
                        draft.members.groups[groupIndex].items[index].phone = value;
                      })
                    }
                    value={member.phone ?? ""}
                  />
                  <Field
                    label="展示链接"
                    onChange={(value) =>
                      updateData((draft) => {
                        draft.members.groups[groupIndex].items[index].profileLink = value;
                      })
                    }
                    value={member.profileLink ?? ""}
                  />
                  <div className="admin-member-card__wide">
                    <TextAreaField
                      label="研究方向（逗号分隔）"
                      onChange={(value) =>
                        updateData((draft) => {
                          draft.members.groups[groupIndex].items[index].researchAreas = parseCommaSeparated(value);
                        })
                      }
                      rows={3}
                      value={toCommaSeparated(member.researchAreas)}
                    />
                  </div>
                  <div className="admin-member-card__wide">
                    <TextAreaField
                      label="简介"
                      onChange={(value) =>
                        updateData((draft) => {
                          draft.members.groups[groupIndex].items[index].summary = value;
                        })
                      }
                      rows={5}
                      value={member.summary}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </PanelCard>
      ))}
    </>
  );
}

function ResearchEditor({
  data,
  updateData,
}: {
  data: SiteData;
  updateData: (mutator: (draft: SiteData) => void) => void;
}) {
  return (
    <>
      <PanelCard title="研究页首屏">
        <HeroEditor
          hero={data.research.hero}
          onChange={(next) =>
            updateData((draft) => {
              draft.research.hero = next;
            })
          }
        />
      </PanelCard>

      <ResearchTable
        addLabel="新增研究方向"
        folder="research"
        items={data.research.directions}
        title="研究方向"
        titleField={data.research.directionsTitle}
        onAdd={() =>
          updateData((draft) => {
            draft.research.directions.push(defaultResearchItem("direction"));
          })
        }
        onItemChange={(index, patch) =>
          updateData((draft) => {
            draft.research.directions[index] = {
              ...draft.research.directions[index],
              ...patch,
            };
          })
        }
        onMove={(index, direction) =>
          updateData((draft) => {
            draft.research.directions = moveItem(draft.research.directions, index, direction);
          })
        }
        onRemove={(index) =>
          updateData((draft) => {
            draft.research.directions.splice(index, 1);
          })
        }
        onTitleChange={(value) => updateData((draft) => void (draft.research.directionsTitle = value))}
      />

      <ResearchTable
        addLabel="新增研究项目"
        folder="projects"
        items={data.research.projects}
        title="研究项目"
        titleField={data.research.projectsTitle}
        onAdd={() =>
          updateData((draft) => {
            draft.research.projects.push(defaultResearchItem("project"));
          })
        }
        onItemChange={(index, patch) =>
          updateData((draft) => {
            draft.research.projects[index] = {
              ...draft.research.projects[index],
              ...patch,
            };
          })
        }
        onMove={(index, direction) =>
          updateData((draft) => {
            draft.research.projects = moveItem(draft.research.projects, index, direction);
          })
        }
        onRemove={(index) =>
          updateData((draft) => {
            draft.research.projects.splice(index, 1);
          })
        }
        onTitleChange={(value) => updateData((draft) => void (draft.research.projectsTitle = value))}
      />
    </>
  );
}

function RecordGroupsEditor({
  data,
  groupType,
  updateData,
}: {
  data: SiteData;
  groupType: "publications";
  updateData: (mutator: (draft: SiteData) => void) => void;
}) {
  const current = data[groupType];

  return (
    <>
      <PanelCard title="出版物页首屏">
        <HeroEditor
          hero={current.hero}
          onChange={(next) =>
            updateData((draft) => {
              draft[groupType].hero = next;
            })
          }
        />
      </PanelCard>

      {current.groups.map((group, groupIndex) => (
        <PanelCard key={group.id} title={group.title}>
          <div className="admin-field-grid">
            <Field
              label="板块标题"
              onChange={(value) =>
                updateData((draft) => {
                  draft[groupType].groups[groupIndex].title = value;
                })
              }
              value={group.title}
            />
            <Field
              label="图标简称"
              onChange={(value) =>
                updateData((draft) => {
                  draft[groupType].groups[groupIndex].icon = value;
                })
              }
              value={group.icon}
            />
            <TextAreaField
              label="板块说明"
              onChange={(value) =>
                updateData((draft) => {
                  draft[groupType].groups[groupIndex].summary = value;
                })
              }
              rows={2}
              value={group.summary}
            />
          </div>

          <RecordItemsTable
            group={group}
            onAdd={() =>
              updateData((draft) => {
                draft[groupType].groups[groupIndex].items.push(defaultRecordItem(group.id));
              })
            }
            onItemChange={(itemIndex, patch) =>
              updateData((draft) => {
                draft[groupType].groups[groupIndex].items[itemIndex] = {
                  ...draft[groupType].groups[groupIndex].items[itemIndex],
                  ...patch,
                };
              })
            }
            onMove={(itemIndex, direction) =>
              updateData((draft) => {
                draft[groupType].groups[groupIndex].items = moveItem(
                  draft[groupType].groups[groupIndex].items,
                  itemIndex,
                  direction,
                );
              })
            }
            onRemove={(itemIndex) =>
              updateData((draft) => {
                draft[groupType].groups[groupIndex].items.splice(itemIndex, 1);
              })
            }
          />
        </PanelCard>
      ))}
    </>
  );
}

function RecruitmentEditor({
  data,
  updateData,
}: {
  data: SiteData;
  updateData: (mutator: (draft: SiteData) => void) => void;
}) {
  return (
    <>
      <PanelCard title="招募页首屏">
        <HeroEditor
          hero={data.recruitment.hero}
          onChange={(next) =>
            updateData((draft) => {
              draft.recruitment.hero = next;
            })
          }
        />
      </PanelCard>

      <PanelCard title="招募卡片">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>标题</th>
                <th>内容</th>
                <th>按钮文案</th>
                <th>链接</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {data.recruitment.cards.map((card, index) => (
                <tr key={card.id}>
                  <td>
                    <input
                      onChange={(event) =>
                        updateData((draft) => {
                          draft.recruitment.cards[index].title = event.target.value;
                        })
                      }
                      value={card.title}
                    />
                  </td>
                  <td>
                    <textarea
                      onChange={(event) =>
                        updateData((draft) => {
                          draft.recruitment.cards[index].content = event.target.value;
                        })
                      }
                      rows={4}
                      value={card.content}
                    />
                  </td>
                  <td>
                    <input
                      onChange={(event) =>
                        updateData((draft) => {
                          draft.recruitment.cards[index].linkLabel = event.target.value;
                        })
                      }
                      value={card.linkLabel ?? ""}
                    />
                  </td>
                  <td>
                    <input
                      onChange={(event) =>
                        updateData((draft) => {
                          draft.recruitment.cards[index].href = event.target.value;
                        })
                      }
                      value={card.href ?? ""}
                    />
                  </td>
                  <td>
                    <RowActions
                      onDelete={() =>
                        updateData((draft) => {
                          draft.recruitment.cards.splice(index, 1);
                        })
                      }
                      onMoveDown={() =>
                        updateData((draft) => {
                          draft.recruitment.cards = moveItem(draft.recruitment.cards, index, 1);
                        })
                      }
                      onMoveUp={() =>
                        updateData((draft) => {
                          draft.recruitment.cards = moveItem(draft.recruitment.cards, index, -1);
                        })
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          className="admin-add-button"
          onClick={() =>
            updateData((draft) => {
              draft.recruitment.cards.push(defaultRecruitmentCard());
            })
          }
          type="button"
        >
          新增卡片
        </button>
      </PanelCard>

      <PanelCard title="招募补充说明">
        <TextAreaField
          label="每行一条"
          onChange={(value) => updateData((draft) => void (draft.recruitment.notes = parseLines(value)))}
          rows={6}
          value={toLines(data.recruitment.notes)}
        />
      </PanelCard>
    </>
  );
}

function RecruitmentEditorV2({
  data,
  updateData,
}: {
  data: SiteData;
  updateData: (mutator: (draft: SiteData) => void) => void;
}) {
  return (
    <>
      <PanelCard title="招募页首屏">
        <HeroEditor
          hero={data.recruitment.hero}
          onChange={(next) =>
            updateData((draft) => {
              draft.recruitment.hero = next;
            })
          }
        />
      </PanelCard>

      <PanelCard title="页面导语" description="显示在页首横幅下方，每行一段。">
        <TextAreaField
          label="导语内容"
          onChange={(value) =>
            updateData((draft) => {
              draft.recruitment.intro = parseLines(value);
            })
          }
          rows={6}
          value={toLines(data.recruitment.intro)}
        />
      </PanelCard>

      <PanelCard title="我们在找谁" description="用于展示实验室欢迎的候选人特征。">
        <div className="admin-field-grid">
          <Field
            label="板块标题"
            onChange={(value) =>
              updateData((draft) => {
                draft.recruitment.audience.title = value;
              })
            }
            value={data.recruitment.audience.title}
          />
          <Field
            label="引导语"
            onChange={(value) =>
              updateData((draft) => {
                draft.recruitment.audience.intro = value;
              })
            }
            value={data.recruitment.audience.intro}
          />
          <Field
            label="补充说明"
            onChange={(value) =>
              updateData((draft) => {
                draft.recruitment.audience.note = value;
              })
            }
            value={data.recruitment.audience.note}
          />
        </div>

        <TextAreaField
          label="候选人特征（每行一条）"
          onChange={(value) =>
            updateData((draft) => {
              draft.recruitment.audience.points = parseLines(value);
            })
          }
          rows={7}
          value={toLines(data.recruitment.audience.points)}
        />
      </PanelCard>

      <PanelCard title="你将学到什么" description="前台会以两列能力卡片展示。">
        <div className="admin-field-grid">
          <Field
            label="板块标题"
            onChange={(value) =>
              updateData((draft) => {
                draft.recruitment.growth.title = value;
              })
            }
            value={data.recruitment.growth.title}
          />
          <Field
            label="引导语"
            onChange={(value) =>
              updateData((draft) => {
                draft.recruitment.growth.intro = value;
              })
            }
            value={data.recruitment.growth.intro}
          />
        </div>

        <div className="admin-member-list">
          {data.recruitment.growth.cards.map((card, index) => (
            <article key={card.id} className="admin-member-card">
              <div className="admin-member-card__header">
                <div className="admin-member-card__meta">
                  <p>成长卡片 {index + 1}</p>
                  <h3>{card.title || "未命名卡片"}</h3>
                </div>

                <RowActions
                  onDelete={() =>
                    updateData((draft) => {
                      draft.recruitment.growth.cards.splice(index, 1);
                    })
                  }
                  onMoveDown={() =>
                    updateData((draft) => {
                      draft.recruitment.growth.cards = moveItem(draft.recruitment.growth.cards, index, 1);
                    })
                  }
                  onMoveUp={() =>
                    updateData((draft) => {
                      draft.recruitment.growth.cards = moveItem(draft.recruitment.growth.cards, index, -1);
                    })
                  }
                />
              </div>

              <div className="admin-field-grid">
                <Field
                  label="卡片标题"
                  onChange={(value) =>
                    updateData((draft) => {
                      draft.recruitment.growth.cards[index].title = value;
                    })
                  }
                  value={card.title}
                />
              </div>

              <TextAreaField
                label="能力点（每行一条）"
                onChange={(value) =>
                  updateData((draft) => {
                    draft.recruitment.growth.cards[index].items = parseLines(value);
                  })
                }
                rows={5}
                value={toLines(card.items)}
              />
            </article>
          ))}
        </div>

        <button
          className="admin-add-button"
          onClick={() =>
            updateData((draft) => {
              draft.recruitment.growth.cards.push(defaultRecruitmentSkillCard());
            })
          }
          type="button"
        >
          新增成长卡片
        </button>
      </PanelCard>

      <PanelCard title="联系入口" description="页尾联系行动按钮。">
        <div className="admin-field-grid">
          <Field
            label="标题"
            onChange={(value) =>
              updateData((draft) => {
                draft.recruitment.callToAction.title = value;
              })
            }
            value={data.recruitment.callToAction.title}
          />
          <Field
            label="按钮文案"
            onChange={(value) =>
              updateData((draft) => {
                draft.recruitment.callToAction.linkLabel = value;
              })
            }
            value={data.recruitment.callToAction.linkLabel}
          />
          <Field
            label="按钮链接"
            onChange={(value) =>
              updateData((draft) => {
                draft.recruitment.callToAction.href = value;
              })
            }
            value={data.recruitment.callToAction.href}
          />
        </div>

        <TextAreaField
          label="说明文字"
          onChange={(value) =>
            updateData((draft) => {
              draft.recruitment.callToAction.content = value;
            })
          }
          rows={4}
          value={data.recruitment.callToAction.content}
        />
      </PanelCard>
    </>
  );
}

function ContactEditor({
  data,
  updateData,
}: {
  data: SiteData;
  updateData: (mutator: (draft: SiteData) => void) => void;
}) {
  return (
    <>
      <PanelCard title="联系方式页首屏">
        <HeroEditor
          hero={data.contact.hero}
          onChange={(next) =>
            updateData((draft) => {
              draft.contact.hero = next;
            })
          }
        />
      </PanelCard>

      <PanelCard title="联系方式表格">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>标签</th>
                <th>值</th>
                <th>备注</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {data.contact.methods.map((method, index) => (
                <tr key={method.id}>
                  <td>
                    <input
                      onChange={(event) =>
                        updateData((draft) => {
                          draft.contact.methods[index].label = event.target.value;
                        })
                      }
                      value={method.label}
                    />
                  </td>
                  <td>
                    <textarea
                      onChange={(event) =>
                        updateData((draft) => {
                          draft.contact.methods[index].value = event.target.value;
                        })
                      }
                      rows={2}
                      value={method.value}
                    />
                  </td>
                  <td>
                    <textarea
                      onChange={(event) =>
                        updateData((draft) => {
                          draft.contact.methods[index].note = event.target.value;
                        })
                      }
                      rows={3}
                      value={method.note ?? ""}
                    />
                  </td>
                  <td>
                    <RowActions
                      onDelete={() =>
                        updateData((draft) => {
                          draft.contact.methods.splice(index, 1);
                        })
                      }
                      onMoveDown={() =>
                        updateData((draft) => {
                          draft.contact.methods = moveItem(draft.contact.methods, index, 1);
                        })
                      }
                      onMoveUp={() =>
                        updateData((draft) => {
                          draft.contact.methods = moveItem(draft.contact.methods, index, -1);
                        })
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          className="admin-add-button"
          onClick={() =>
            updateData((draft) => {
              draft.contact.methods.push(defaultContactMethod());
            })
          }
          type="button"
        >
          新增联系方式
        </button>
      </PanelCard>

      <PanelCard title="地图与到访说明">
        <div className="admin-field-grid">
          <Field
            label="地图图片说明"
            onChange={(value) => updateData((draft) => void (draft.contact.mapAlt = value))}
            value={data.contact.mapAlt}
          />
          <UploadField
            folder="contact"
            onChange={(value) => updateData((draft) => void (draft.contact.mapImage = value))}
            value={data.contact.mapImage}
          />
          <Field
            label="到访提示标题"
            onChange={(value) => updateData((draft) => void (draft.contact.transitTitle = value))}
            value={data.contact.transitTitle}
          />
          <TextAreaField
            label="到访提示正文（每行一段）"
            onChange={(value) => updateData((draft) => void (draft.contact.transitText = parseLines(value)))}
            rows={5}
            value={toLines(data.contact.transitText)}
          />
        </div>
      </PanelCard>
    </>
  );
}

function RecruitmentEditorV3({
  data,
  updateData,
}: {
  data: SiteData;
  updateData: (mutator: (draft: SiteData) => void) => void;
}) {
  return (
    <>
      <PanelCard title="招募页首屏">
        <HeroEditor
          hero={data.recruitment.hero}
          onChange={(next) =>
            updateData((draft) => {
              draft.recruitment.hero = next;
            })
          }
        />
      </PanelCard>

      <PanelCard title="页面导语" description="显示在页首横幅下方，每行一段。">
        <TextAreaField
          label="导语内容"
          onChange={(value) =>
            updateData((draft) => {
              draft.recruitment.intro = parseLines(value);
            })
          }
          rows={6}
          value={toLines(data.recruitment.intro)}
        />
      </PanelCard>

      <PanelCard title="我们在找谁" description="用于展示实验室欢迎的候选人特征。">
        <div className="admin-field-grid">
          <Field
            label="板块标题"
            onChange={(value) =>
              updateData((draft) => {
                draft.recruitment.audience.title = value;
              })
            }
            value={data.recruitment.audience.title}
          />
          <Field
            label="引导语"
            onChange={(value) =>
              updateData((draft) => {
                draft.recruitment.audience.intro = value;
              })
            }
            value={data.recruitment.audience.intro}
          />
          <Field
            label="补充说明"
            onChange={(value) =>
              updateData((draft) => {
                draft.recruitment.audience.note = value;
              })
            }
            value={data.recruitment.audience.note}
          />
        </div>

        <TextAreaField
          label="候选人特征（每行一条）"
          onChange={(value) =>
            updateData((draft) => {
              draft.recruitment.audience.points = parseLines(value);
            })
          }
          rows={7}
          value={toLines(data.recruitment.audience.points)}
        />
      </PanelCard>

      <PanelCard title="你将在实验室学到什么" description="前台会以两列能力卡片展示。">
        <div className="admin-field-grid">
          <Field
            label="板块标题"
            onChange={(value) =>
              updateData((draft) => {
                draft.recruitment.growth.title = value;
              })
            }
            value={data.recruitment.growth.title}
          />
          <Field
            label="引导语"
            onChange={(value) =>
              updateData((draft) => {
                draft.recruitment.growth.intro = value;
              })
            }
            value={data.recruitment.growth.intro}
          />
        </div>

        <div className="admin-member-list">
          {data.recruitment.growth.cards.map((card, index) => (
            <article key={card.id} className="admin-member-card">
              <div className="admin-member-card__header">
                <div className="admin-member-card__meta">
                  <p>成长卡片 {index + 1}</p>
                  <h3>{card.title || "未命名卡片"}</h3>
                </div>

                <RowActions
                  onDelete={() =>
                    updateData((draft) => {
                      draft.recruitment.growth.cards.splice(index, 1);
                    })
                  }
                  onMoveDown={() =>
                    updateData((draft) => {
                      draft.recruitment.growth.cards = moveItem(draft.recruitment.growth.cards, index, 1);
                    })
                  }
                  onMoveUp={() =>
                    updateData((draft) => {
                      draft.recruitment.growth.cards = moveItem(draft.recruitment.growth.cards, index, -1);
                    })
                  }
                />
              </div>

              <div className="admin-field-grid">
                <Field
                  label="卡片标题"
                  onChange={(value) =>
                    updateData((draft) => {
                      draft.recruitment.growth.cards[index].title = value;
                    })
                  }
                  value={card.title}
                />
              </div>

              <TextAreaField
                label="能力点（每行一条）"
                onChange={(value) =>
                  updateData((draft) => {
                    draft.recruitment.growth.cards[index].items = parseLines(value);
                  })
                }
                rows={5}
                value={toLines(card.items)}
              />
            </article>
          ))}
        </div>

        <button
          className="admin-add-button"
          onClick={() =>
            updateData((draft) => {
              draft.recruitment.growth.cards.push(defaultRecruitmentSkillCard());
            })
          }
          type="button"
        >
          新增成长卡片
        </button>
      </PanelCard>

      <PanelCard title="联系入口" description="页尾联系行动按钮。">
        <div className="admin-field-grid">
          <Field
            label="标题"
            onChange={(value) =>
              updateData((draft) => {
                draft.recruitment.callToAction.title = value;
              })
            }
            value={data.recruitment.callToAction.title}
          />
          <Field
            label="按钮文案"
            onChange={(value) =>
              updateData((draft) => {
                draft.recruitment.callToAction.linkLabel = value;
              })
            }
            value={data.recruitment.callToAction.linkLabel}
          />
          <Field
            label="按钮链接"
            onChange={(value) =>
              updateData((draft) => {
                draft.recruitment.callToAction.href = value;
              })
            }
            value={data.recruitment.callToAction.href}
          />
        </div>

        <TextAreaField
          label="说明文字"
          onChange={(value) =>
            updateData((draft) => {
              draft.recruitment.callToAction.content = value;
            })
          }
          rows={4}
          value={data.recruitment.callToAction.content}
        />
      </PanelCard>
    </>
  );
}

function ContactEditorV2({
  data,
  updateData,
}: {
  data: SiteData;
  updateData: (mutator: (draft: SiteData) => void) => void;
}) {
  return (
    <>
      <PanelCard title="联系方式页首屏">
        <HeroEditor
          hero={data.contact.hero}
          onChange={(next) =>
            updateData((draft) => {
              draft.contact.hero = next;
            })
          }
        />
      </PanelCard>

      <PanelCard title="联系信息" description="地址支持换行输入，前台会按多行正文方式展示。">
        <div className="admin-member-list">
          {data.contact.methods.map((method, index) => (
            <article key={method.id} className="admin-member-card">
              <div className="admin-member-card__header">
                <div className="admin-member-card__meta">
                  <p>联系方式 {index + 1}</p>
                  <h3>{method.label || "未命名联系方式"}</h3>
                </div>

                <RowActions
                  onDelete={() =>
                    updateData((draft) => {
                      draft.contact.methods.splice(index, 1);
                    })
                  }
                  onMoveDown={() =>
                    updateData((draft) => {
                      draft.contact.methods = moveItem(draft.contact.methods, index, 1);
                    })
                  }
                  onMoveUp={() =>
                    updateData((draft) => {
                      draft.contact.methods = moveItem(draft.contact.methods, index, -1);
                    })
                  }
                />
              </div>

              <div className="admin-field-grid">
                <Field
                  label="标签"
                  onChange={(value) =>
                    updateData((draft) => {
                      draft.contact.methods[index].label = value;
                    })
                  }
                  value={method.label}
                />
              </div>

              <TextAreaField
                label="正文内容"
                onChange={(value) =>
                  updateData((draft) => {
                    draft.contact.methods[index].value = value;
                  })
                }
                rows={4}
                value={method.value}
              />

              <TextAreaField
                label="补充说明"
                onChange={(value) =>
                  updateData((draft) => {
                    draft.contact.methods[index].note = value;
                  })
                }
                rows={3}
                value={method.note ?? ""}
              />
            </article>
          ))}
        </div>

        <button
          className="admin-add-button"
          onClick={() =>
            updateData((draft) => {
              draft.contact.methods.push(defaultContactMethod());
            })
          }
          type="button"
        >
          新增联系方式
        </button>
      </PanelCard>

      <PanelCard title="地图与到访说明" description="地图仍为站内静态图片，到访提示每行一段。">
        <div className="admin-field-grid">
          <Field
            label="地图图片说明"
            onChange={(value) => updateData((draft) => void (draft.contact.mapAlt = value))}
            value={data.contact.mapAlt}
          />
          <UploadField
            folder="contact"
            onChange={(value) => updateData((draft) => void (draft.contact.mapImage = value))}
            value={data.contact.mapImage}
          />
          <Field
            label="到访提示标题"
            onChange={(value) => updateData((draft) => void (draft.contact.transitTitle = value))}
            value={data.contact.transitTitle}
          />
          <TextAreaField
            label="到访提示正文（每行一段，最后一行会强调显示）"
            onChange={(value) => updateData((draft) => void (draft.contact.transitText = parseLines(value)))}
            rows={6}
            value={toLines(data.contact.transitText)}
          />
        </div>
      </PanelCard>
    </>
  );
}

function HighlightsTable({
  title,
  items,
  onAdd,
  onChange,
  onDelete,
  onMove,
}: {
  title: string;
  items: HighlightCard[];
  onAdd: () => void;
  onChange: (index: number, key: keyof HighlightCard, value: string) => void;
  onDelete: (index: number) => void;
  onMove: (index: number, direction: -1 | 1) => void;
}) {
  return (
    <div className="admin-subsection">
      <h3>{title}</h3>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>大字</th>
              <th>说明</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <input onChange={(event) => onChange(index, "title", event.target.value)} value={item.title} />
                </td>
                <td>
                  <input onChange={(event) => onChange(index, "value", event.target.value)} value={item.value} />
                </td>
                <td>
                  <textarea onChange={(event) => onChange(index, "caption", event.target.value)} rows={3} value={item.caption} />
                </td>
                <td>
                  <RowActions onDelete={() => onDelete(index)} onMoveDown={() => onMove(index, 1)} onMoveUp={() => onMove(index, -1)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="admin-add-button" onClick={onAdd} type="button">
        新增卡片
      </button>
    </div>
  );
}

function ResearchTable({
  title,
  titleField,
  items,
  addLabel,
  folder,
  onTitleChange,
  onItemChange,
  onRemove,
  onMove,
  onAdd,
}: {
  title: string;
  titleField: string;
  items: ResearchItem[];
  addLabel: string;
  folder: string;
  onTitleChange: (value: string) => void;
  onItemChange: (index: number, patch: Partial<ResearchItem>) => void;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onAdd: () => void;
}) {
  return (
    <PanelCard title={title}>
      <Field label="板块标题" onChange={onTitleChange} value={titleField} />
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>摘要</th>
              <th>标签（逗号分隔）</th>
              <th>图片</th>
              <th>链接</th>
              <th>显示</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <input onChange={(event) => onItemChange(index, { title: event.target.value })} value={item.title} />
                </td>
                <td>
                  <textarea onChange={(event) => onItemChange(index, { summary: event.target.value })} rows={3} value={item.summary} />
                </td>
                <td>
                  <textarea
                    onChange={(event) => onItemChange(index, { tags: parseCommaSeparated(event.target.value) })}
                    rows={3}
                    value={toCommaSeparated(item.tags)}
                  />
                </td>
                <td>
                  <UploadField folder={folder} onChange={(value) => onItemChange(index, { image: value })} value={item.image} />
                </td>
                <td>
                  <input onChange={(event) => onItemChange(index, { link: event.target.value })} value={item.link ?? ""} />
                </td>
                <td>
                  <ToggleField checked={item.visible} label="显示" onChange={(checked) => onItemChange(index, { visible: checked })} />
                </td>
                <td>
                  <RowActions onDelete={() => onRemove(index)} onMoveDown={() => onMove(index, 1)} onMoveUp={() => onMove(index, -1)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="admin-add-button" onClick={onAdd} type="button">
        {addLabel}
      </button>
    </PanelCard>
  );
}

function RecordItemsTable({
  group,
  onItemChange,
  onRemove,
  onMove,
  onAdd,
}: {
  group: RecordGroup;
  onItemChange: (index: number, patch: Partial<RecordGroup["items"][number]>) => void;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onAdd: () => void;
}) {
  return (
    <div className="admin-subsection">
      <h3>条目表格</h3>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>副标题</th>
              <th>年份/期次</th>
              <th>摘要</th>
              <th>链接</th>
              <th>显示</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {group.items.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <textarea onChange={(event) => onItemChange(index, { title: event.target.value })} rows={2} value={item.title} />
                </td>
                <td>
                  <textarea onChange={(event) => onItemChange(index, { subtitle: event.target.value })} rows={2} value={item.subtitle} />
                </td>
                <td>
                  <input onChange={(event) => onItemChange(index, { meta: event.target.value })} value={item.meta} />
                </td>
                <td>
                  <textarea onChange={(event) => onItemChange(index, { summary: event.target.value })} rows={4} value={item.summary} />
                </td>
                <td>
                  <input onChange={(event) => onItemChange(index, { link: event.target.value })} value={item.link ?? ""} />
                </td>
                <td>
                  <ToggleField checked={item.visible} label="显示" onChange={(checked) => onItemChange(index, { visible: checked })} />
                </td>
                <td>
                  <RowActions onDelete={() => onRemove(index)} onMoveDown={() => onMove(index, 1)} onMoveUp={() => onMove(index, -1)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="admin-add-button" onClick={onAdd} type="button">
        新增条目
      </button>
    </div>
  );
}
