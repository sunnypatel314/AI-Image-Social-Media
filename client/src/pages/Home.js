import { useEffect, useState } from "react";
import Card from "../components/Card";
import FormField from "../components/FormField";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const RenderCards = ({ data, user }) => {
  if (data?.length > 0) {
    return data.map((post) => (
      <Card
        key={post.id}
        id={post.id}
        creator={post.creator}
        prompt={post.prompt}
        photoUrl={post.photo_url}
        createdDate={post.created_date}
        user={user}
      />
    ));
  }
  return;
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [startingList, setStartingList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState("");

  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const searchResults = startingList.filter(
      (item) =>
        item.creator.toLowerCase().startsWith(searchText.toLowerCase()) ||
        item.prompt.toLowerCase().startsWith(searchText.toLowerCase())
    );
    setAllPosts(searchResults);
  }, [searchText]);

  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/log-in");
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        if (localStorage.getItem("token")) {
          const response = await fetch("http://localhost:8080/api/v1/posts", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (response.ok) {
            const result = await response.json();
            setAllPosts(result.data.reverse());
            setStartingList(result.data.reverse());
            setUser(result.user);
          }
        }
      } catch (error) {
        console.log(error.message);
        alert(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <>
      <Navbar logOut={logOut} page={"Home"} />
      <main className="sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]">
        <section className="w-full h-full mx-auto">
          <div>
            <h1 className="font-extrabold text-[#222328] text-center text-[32px]">
              Welcome {user && `${user},`} to the Community Showcase
            </h1>
            <p className="mt-2 text-[#666e75] text-[14px] text-center">
              Browse through a collection of imaginative and visually stunning
              images generated by DALL-E AI
            </p>
          </div>

          <div className="mt-10 mx-auto flex flex-row items-center justify-center w-full">
            <div className="w-1/4"></div>
            <div className="w-2/5 mx-auto">
              <FormField
                labelName=""
                type="text"
                name="text"
                placeholder="Search posts or creators..."
                value={searchText}
                handleChange={handleSearchChange}
              />
            </div>
            <div className="w-1/4"></div>
          </div>

          <div className="mt-5">
            {loading ? (
              <div className="flex justify-center items-center w-full h-[40vh]">
                <Loader />
              </div>
            ) : (
              <>
                {searchText && user && (
                  <h2 className="font-medium text-center text-gray-600 text-xl mb-3">
                    Showing Results for{" "}
                    <span className="text-[#222328] font-semibold">
                      {searchText}
                    </span>
                    :
                  </h2>
                )}

                {allPosts.length === 0 ? (
                  <h2 className="mt-5 text-center font-bold text-[#6469ff] text-xl uppercase">
                    {user
                      ? "No posts found"
                      : "Sign in to view and create images"}
                  </h2>
                ) : (
                  <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
                    <RenderCards data={allPosts} user={user} />
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
