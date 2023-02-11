import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import Card from "../Card";

export default function CallTabs({ toggleModal }) {
  const data = [
    {
      label: "Açık Çağrılar",
      value: "acik",
      desc: <Card toggleModal={toggleModal} />,
    },
    {
      label: "Kapalı Çağrılar",
      value: "kapali",
      desc: <Card />,
    },
    {
      label: "Taslaklar",
      value: "taslaklar",
      desc: <Card />,
    },
  ];

  return (
    <Tabs value="acik">
      <TabsHeader>
        {data.map(({ label, value }) => (
          <Tab key={value} value={value}>
            {label}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody>
        {data.map(({ value, desc }) => (
          <TabPanel key={value} value={value} className="my-5">
            {desc}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
}
