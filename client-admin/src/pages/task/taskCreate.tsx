import { Helmet } from "react-helmet-async";

import { TaskCreate } from "src/sections/task/view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> DTS Challeng | Task - Create</title>
      </Helmet>

      <TaskCreate />
    </>
  );
}
