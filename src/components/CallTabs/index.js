import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import Card from "../Card";

const renderOpenCallContent = (calls) => {
  return calls?.map((call, i) => {
    return (
      <Card
        key={i}
        title={call.title}
        description={call.description}
        startDate={call.date.startDate}
        endDate={call.date.endDate}
        needOfVolunteer={call.needOfVolunteer}
        location=""
      />
    );
  });
};

export default function CallTabs({ calls }) {
  const data = [
    {
      label: "Açık Çağrılar",
      value: "acik",
      content: renderOpenCallContent(calls),
    },
    {
      label: "Kapalı Çağrılar",
      value: "kapali",
      content: "",
    },
    {
      label: "Taslaklar",
      value: "taslaklar",
      content: "",
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
        {data.map(({ value, content }) => (
          <TabPanel key={value} value={value} className="my-5">
            <div className="flex justify-center space-x-10">{content}</div>
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
}
