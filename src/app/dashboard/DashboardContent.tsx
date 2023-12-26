import React from "react";



const DashboardContent = () => {
  return (
    <div className="w-full py-4 flex flex-col gap-4">
      <div className="bg-dark_light w-full h-1/2 rounded-lg text-dark font-semibold p-4">
        <div className="w-1/3 h-full flex flex-col justify-center gap-6">
          <h1 className="font-black text-5xl">
            Mining <br /> Expedition
          </h1>
          <h4 className="font-semibold text-lg">
            Send your Crabada to mine for valuable treasure! Earns CRA and TUS
            as rewards.
          </h4>
        </div>
      </div>
     
     
      <div className="w-full h-1/2 rounded-lg flex gap-4">
        <div className="bg-dark_light w-full rounded-lg text-dark font-semibold p-4">
          <div className="w-full h-full flex flex-col justify-end gap-6">
            <h1 className="font-black text-5xl">Looting Mission</h1>
            <h4 className="font-semibold text-lg">
              Steal rewards from unaware miners! Earns CRA and TUS as rewards.
            </h4>
          </div>
        </div>
        <div className="bg-dark_light w-full rounded-lg text-dark font-semibold p-4">
          <div className="w-full h-full flex flex-col justify-end gap-6">
            <h1 className="font-black text-5xl">Build Your Team</h1>
            <h4 className="font-semibold text-lg">
              Create your Crabada teams to be sent out on expeditions or
              missions!
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
