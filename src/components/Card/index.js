import React from "react";
import { Button } from "@material-tailwind/react";
import { Chip } from "@material-tailwind/react";

export default function Card({
  title,
  detail,
  date,
  numberOfApplication,
  numberOfCall,
  scope,
  titleOfStk,
  toggleModal
}) {
  return (
    <div className="max-w-md h-auto shadow-md hover:shadow-xl p-8">
      <p>{title}</p>
      <p>{detail}</p>
      <p>{date}</p>
      <p>Başvuran kişi sayısı: {numberOfApplication}</p>
      <div className="flex items-center justify-between">
        <p>
          Aranan kişi sayısı:
          {numberOfCall}
        </p>
        <Button variant="text" onClick={() => toggleModal(true)}>
          Başvuran kişileri gör
        </Button>
      </div>

      <div className="flex flex-wrap justify-start space-x-2 my-1">
        <Chip color="indigo" value="x" />
        <Chip color="indigo" value="x" />
        <Chip color="indigo" value="x" />
      </div>
      <p>{titleOfStk}</p>
      <div className="flex justify-end">
        <Button variant="outlined" className="mx-2">
          Detaya Git
        </Button>
        <Button color="green">Başvur</Button>
      </div>
    </div>
  );
}
