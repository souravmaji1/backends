// type
type IMenuDataType = {
  id: number;
  title: string;
  link: string;
  sub_menu?: {
    title: string;
    link: string;
  }[];
}

const menu_data: IMenuDataType[] = [
  {
    id: 1,
    title: 'Home',
    link: '#',
  },
  {
    id: 2,
    title: 'ABOUT US',
    link: '/about',
  },
  {
    id: 6,
    title: 'CONTACT',
    link: '/contact',
  },
]

export default menu_data;