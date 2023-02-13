import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

export default function CallTabs({ data }) {
  return (
    <>
      {data && (
        <Tabs value={data[0]?.value}>
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
                <div className="grid lg:grid-cols-2 gap-14 place-items-stretch items-center">
                  {content}
                </div>
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      )}
    </>
  );
}
