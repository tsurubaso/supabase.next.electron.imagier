import NavBar from "../../components/NavBar";
import QuillEditor from "../../components/QuillEditor";

const EditorPage = () => {
  return (
    <div>
      <NavBar />
      <div>
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
            Quill Editor
          </h1>
          <QuillEditor />
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
