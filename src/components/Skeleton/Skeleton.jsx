import React from "react";
import { Card, Skeleton, Table, TableBody, TableCell, TableHeader, TableRow } from "@nextui-org/react";

export default function CustomSkeleton({thead=5,tbody=5}) {
  const numberOfSkeletons = 10
  return (
    <>
    <div className="space-y-2">
      {/* Skeleton Table Header */}
      <div className="flex">
        {[...Array(thead)].map((_, index) => (
          <div key={index} className="h-5 bg-gray-300 rounded-full w-1/5 mx-1 mt-7"></div>
        ))}
      </div>

      {/* Skeleton Table Rows */}
      {[...Array(tbody)].map((_, rowIndex) => (
        <div key={rowIndex} className="flex">
          {[...Array(5)].map((_, columnIndex) => (
            <div key={columnIndex} className="h-4 bg-gray-200 rounded-full w-1/5 mx-2 my-3 mt-5"></div>
          ))}
        </div>
      ))}
    </div>
    

      {/* <Card  className="w-full bg-white space-y-5 p-4" radius="lg">
        {[...Array(1)].map((_, index) => (
          <div key={index} className="flex flex-row gap-5">
            <Skeleton className="w-full rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>
          </div>))}
        </Card> */}
      {/* <Card  className="w-full bg-white space-y-5 p-4" radius="lg">
        {[...Array(numberOfSkeletons)].map((_, index) => (
          <div key={index} className="flex flex-row gap-5">
            <Skeleton className="w-full rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-full rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-full rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-full rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-full rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-full rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>

          </div>))}
        </Card> */}


    </>

  );
}
