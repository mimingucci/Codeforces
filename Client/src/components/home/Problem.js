import "@vaadin/split-layout";
import Landing from "../CodeEditor/Components/Landing";

const Problem = () => {
  return (
    <vaadin-split-layout orientation="vertical">
      <div>Layout A</div>
      <div>
        <Landing />
      </div>
    </vaadin-split-layout>
  );
};

export default Problem;
