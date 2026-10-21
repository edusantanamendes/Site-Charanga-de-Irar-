import { useSite } from "../contexts/SiteContext";
import { brand } from "../config/brand";

export default function OfficialLogo({
  className = "",
  decorative = false,
  priority = false,
}) {
  const { settings } = useSite();
  return (
    <img
      className={`official-logo ${className}`}
      src={settings?.logoUrl || brand.logoUrl}
      alt={decorative ? "" : brand.logoAlt}
      width="640"
      height="640"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}
