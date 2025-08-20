import { useCallback } from "react";

import Wizard from "@/components/wizard/Wizard";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

const createDao = () => {
  const handleFinish = useCallback(() => {
    // Example finish action - replace with real submission logic
    // eslint-disable-next-line no-console
    console.log("Wizard finished! Implement submission logic here.");
  }, []);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-8 py-10">
        <div className="text-center space-y-3 max-w-2xl">
          <h1 className={title()}>DAO Creation Wizard</h1>
          <p className="text-default-500 text-sm md:text-base">
            This is a placeholder multi-step wizard. Each step currently only
            displays its title.
          </p>
        </div>

        <div className="w-full max-w-3xl">
          <Wizard onFinish={handleFinish} />
        </div>
      </section>
    </DefaultLayout>
  );
};

export default createDao;
