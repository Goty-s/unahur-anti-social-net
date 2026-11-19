import styles from "./UserIcon.module.css";

const COLORS = ["#e57373", "#64b5f6", "#81c784", "#ffd54f", "#ba68c8", "#4db6ac", "#ff8a65", "#7986cb"];

function colorFor(nick: string): string {
  let hash = 0;
  for (const char of nick) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return COLORS[hash % COLORS.length];
}

interface UserIconProps {
  nick: string;
  size?: "sm" | "md" | "lg";
}

export default function UserIcon({ nick, size = "md" }: UserIconProps) {
  return (
    <span
      className={`${styles.avatar} ${styles[size]}`}
      style={{ backgroundColor: colorFor(nick) }}
      aria-hidden="true"
    >
      {nick.charAt(0).toUpperCase()}
    </span>
  );
}