import { Helmet } from "react-helmet-async";

import { TaskView } from "src/sections/task/view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> DTS Challeng | Tasks</title>
      </Helmet>

      <TaskView />
    </>
  );
}
