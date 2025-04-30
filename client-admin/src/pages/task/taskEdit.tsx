import { Helmet } from "react-helmet-async";

import { TaskEdit } from "src/sections/task/view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> DTS Challeng | Task - Edit</title>
      </Helmet>

      <TaskEdit />
    </>
  );
}
