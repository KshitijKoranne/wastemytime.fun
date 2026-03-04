"use client";

import Link from "next/link";
import Image from "next/image";
import { activities } from "@/data/activities";

interface Props {
  currentId: string;
  labelColor?: string;
}

export default function YouMayLike({ currentId, labelColor = "rgba(255,255,255,0.35)" }: Props) {
  const others = activities.filter((a) => a.id !== currentId);

  return (
    <div style={{ width: "100%" }}>
      <p
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: labelColor,
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        you may also like
      </p>

      <div
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          paddingBottom: 4,
          scrollbarWidth: "none",
        }}
      >
        {others.map((activity) => (
          <Link
            key={activity.id}
            href={activity.path}
            style={{
              flexShrink: 0,
              width: 150,
              height: 96,
              borderRadius: 14,
              overflow: "hidden",
              position: "relative",
              display: "block",
              textDecoration: "none",
              background: activity.bg,
              boxShadow: "0 4px 18px rgba(0,0,0,0.28)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = "translateY(-3px)";
              el.style.boxShadow = "0 10px 28px rgba(0,0,0,0.38)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "0 4px 18px rgba(0,0,0,0.28)";
            }}
          >
            {activity.image && (
              <Image
                src={activity.image}
                alt={activity.title}
                fill
                style={{ objectFit: "cover", objectPosition: "center top" }}
                sizes="150px"
              />
            )}
            {/* Gradient overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 8,
                left: 9,
                right: 9,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: 1.2,
                  margin: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {activity.title}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.65)",
                  margin: "2px 0 0",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {activity.tagline}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
