import { permanentRedirect } from "next/navigation";

/** The old work index. Projects are submissions now, listed at /list (R2). */
export default function ProjectsPage() {
  permanentRedirect("/list");
}
