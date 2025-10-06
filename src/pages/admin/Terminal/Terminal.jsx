import React, { useState, lazy, Suspense } from "react";
import Button from "../../../components/ui/button/Button";
const DeviceRequest = lazy(() => import("../../admin/Terminal/DeviceRequest"));
const TerminalDevices = lazy(() =>
  import("../../admin/Terminal/TerminalDevices")
);
import LoaderEmpt from "../../../components/loader/LoaderEmpt";



const Terminal = () => {
  const [activeView, setActiveView] = useState("terminal");

  return (
    <div className="p-4">
      {/* View toggle buttons */}
      <div className="flex space-x-3 mb-6">
        <Button
          label="Active Terminals"
          onClick={() => setActiveView("terminal")}
          type="button"
          isIcon={false}
          variant={activeView === "terminal" ? "primary" : "outline"}
        />
        <Button
          label="Device Requests"
          onClick={() => setActiveView("request")}
          type="button"
          isIcon={false}
          variant={activeView === "request" ? "primary" : "outline"}
        />
      </div>
      <Suspense fallback={<LoaderEmpt />}>
        {activeView === "terminal" && <TerminalDevices />}

        {activeView === "request" && <DeviceRequest />}
      </Suspense>
    </div>
  );
};

export default Terminal;
