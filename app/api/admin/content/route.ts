import { NextResponse, type NextRequest } from "next/server";
import { isAuthorizedRequest } from "@/lib/auth";
import { normalizeMemberSlug } from "@/lib/format";
import { archiveExpiredNews, writeSiteData } from "@/lib/site-data";
import type { SiteData } from "@/types/site";

export async function POST(request: NextRequest) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json(
      {
        ok: false,
        message: "未授权",
      },
      { status: 401 },
    );
  }

  const body = (await request.json()) as { data?: SiteData };

  if (!body.data) {
    return NextResponse.json(
      {
        ok: false,
        message: "缺少站点数据",
      },
      { status: 400 },
    );
  }

  const usedMemberSlugs = new Set<string>();

  const normalizedData: SiteData = {
    ...body.data,
    about: {
      ...body.data.about,
      introImageAlt: body.data.about.introImageAlt?.trim() || "实验室介绍配图",
    },
    members: {
      ...body.data.members,
      groups: body.data.members.groups.map((group) => ({
        ...group,
        items: group.items.map((member, index) => {
          const baseSlug = normalizeMemberSlug(member.slug, member.name, member.id || `${group.id}-${index + 1}`);
          let nextSlug = baseSlug;
          let suffix = 2;

          while (usedMemberSlugs.has(nextSlug)) {
            nextSlug = `${baseSlug}-${suffix}`;
            suffix += 1;
          }

          usedMemberSlugs.add(nextSlug);

          return {
            ...member,
            slug: nextSlug,
          };
        }),
      })),
    },
  };

  const archiveResult = await archiveExpiredNews(normalizedData);
  await writeSiteData(archiveResult.data);

  return NextResponse.json({
    ok: true,
    data: archiveResult.data,
    archivedCount: archiveResult.archivedItems.length,
    exportPath: archiveResult.exportPath,
  });
}
