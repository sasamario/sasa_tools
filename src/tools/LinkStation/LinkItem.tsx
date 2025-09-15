import type { Link } from "./LinkStation";

export type LinkItemProps = {
  link: Link[];
};

export default function LinkItem({ link }: LinkItemProps) {
  return (
    <ul>
      {link.map((item) => (
        <li key={item.name}>
          <a href={item.url} target="_blank">
            {item.name}
          </a>
        </li>
      ))}
    </ul>
  );
}
