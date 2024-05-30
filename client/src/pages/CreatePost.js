import { useState, useEffect } from "react";
import { preview } from "../assets";
import { getRandomPrompt } from "../utils";
import FormField from "../components/FormField";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ prompt: "", photo: "", name: "" });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isUser, setIsUser] = useState(
    localStorage.getItem("token") ? true : false
  );

  const logOut = () => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
    }
    navigate("/log-in");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.photo) {
      setLoading(true);
      setIsDisabled(true);
      try {
        const response = await fetch("http://localhost:8080/api/v1/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(form),
        });
        await response.json();
        navigate("/");
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
        setIsDisabled(false);
      }
    } else {
      alert("Please enter a prompt and generate an image");
    }
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };
  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        setIsDisabled(true);
        const response = await fetch("http://localhost:8080/api/v1/dalle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: form.prompt,
          }),
        });

        const data = await response.json();
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (err) {
        alert(err);
      } finally {
        setGeneratingImg(false);
        setIsDisabled(false);
      }
    } else {
      alert("Please provide proper prompt");
    }
  };

  // useEffect(() => {
  //   const getUser = () => {
  //     const token = localStorage.getItem("token") || null;
  //     if (token) {
  //       setIsUser(true);
  //     }
  //   };
  //   getUser();
  // }, []);

  return (
    <>
      <Navbar logOut={logOut} page={"CreatePost"} />
      <main className="sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]">
        <section className="max-w-7xl mx-auto">
          <div>
            <h1 className="font-extrabold text-[#222328] text-[32px] text-center">
              Create Image
            </h1>
            <p className="mt-2 text-[#666e75] text-[18px] text-center w-full">
              {!isUser ? "Log in to start creating" : "Create"} imaginative and
              visually stunning images generated through DALLE-AI and share them
              with the community.
            </p>
          </div>
          <form
            className="mt-16 w-full flex flex-col items-center"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col items-center justify-center gap-5">
              <FormField
                labelName="Prompt"
                type="text"
                name="prompt"
                placeholder={"Prompt"}
                value={form.prompt}
                handleChange={handleChange}
                isSurpriseMe
                handleSurpriseMe={handleSurpriseMe}
                isDisabled={form.photo || generatingImg}
              />
              <div
                className="relative bg-gray-50 border border-gray-300
            text-gray-900 text-sm rounded-lg focus:ring-blue-500
              focus:border-blue-500 w-96 aspect-square p-3 flex justify-center 
              items-center"
              >
                {form.photo ? (
                  <img
                    src={form.photo}
                    alt={form.prompt}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={preview}
                    alt={"preview"}
                    className="w-9/12 h-9/12 object-contain opacity-60"
                  />
                )}
                {generatingImg && (
                  <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                    <Loader />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-5 w-full flex items-center justify-center gap-5">
              <button
                type="button"
                disabled={isDisabled || (!form.prompt && isUser)}
                onClick={() => {
                  if (isUser) {
                    generateImage();
                  } else {
                    navigate("/log-in");
                  }
                }}
                className={`text-white ${
                  form.prompt || !isUser ? "bg-green-600" : "bg-gray-400"
                }  font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center`}
              >
                {generatingImg
                  ? "Generating..."
                  : !isUser
                  ? "Log in to generate images"
                  : "Generate"}
              </button>
            </div>
            <div className="mt-10 flex flex-col items-center justify-center">
              <p className="mt-2 text-[#666e75] text-[14px]">
                ** Once you have created the image you want, you can share it
                with others in the community **
              </p>
              <button
                type="submit"
                disabled={isDisabled || !form.photo}
                className={`mt-3 text-white ${
                  form.photo ? "bg-blue-600" : "bg-gray-400"
                } font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center`}
              >
                {loading ? "Sharing..." : "Share with the Community"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
};

export default CreatePost;
