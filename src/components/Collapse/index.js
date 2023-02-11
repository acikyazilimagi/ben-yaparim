import { Fragment, useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import { Chip } from "@material-tailwind/react";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function Collapse() {
  const [open, setOpen] = useState(0);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <div className="w-96">
      <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
        <AccordionHeader onClick={() => handleOpen(1)}>
          Ad Soyad
        </AccordionHeader>
        <AccordionBody>
          <p>Başvurduğu il: İstanbul</p>
          <Chip color="indigo" value="x" />
          <Chip color="indigo" value="x" />
          <div className="flex justify-center">
            <Button color="green" className="mx-2">
              Ön Onay
            </Button>
            <Button color="red">Reddet</Button>
          </div>
        </AccordionBody>
      </Accordion>
    </div>
  );
}
