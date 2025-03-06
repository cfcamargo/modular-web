export interface MenuItem {
  path: string;
  name: string;
  subItems?: { path: string; name: string }[];
}
