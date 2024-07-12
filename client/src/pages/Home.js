import { useEffect, useState, useContext } from "react";
import Card from "../components/Card";
import FormField from "../components/FormField";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { UserContext } from "../App";
import { jwtDecode } from "jwt-decode";
// import { jwtDecode } from "jwt-decode";

const RenderCards = ({ data, username }) => {
  if (data?.length > 0) {
    return data.map((post) => (
      <Card
        key={post.id}
        id={post.id}
        creator={post.creator}
        prompt={post.prompt}
        photoUrl={post.photo_url}
        createdDate={post.created_date}
        username={username}
      />
    ));
  }
  return;
};

const Home = () => {
  const { user, setUser } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [startingList, setStartingList] = useState([]);
  const [searchText, setSearchText] = useState("");
  // const [user, setUser] = useState("");
  // const [username, setUsername] = useState("");

  const IP = "18.116.112.252";
  const PORT = "8080";

  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const checkToken = () => {
      if (localStorage.getItem("token") && !user) {
        const decoded = jwtDecode(localStorage.getItem("token"));
        setUser(decoded.username);
      }
    };
    checkToken();
  }, []);

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
    setUser("");
    navigate("/log-in");
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        if (user) {
          const response = await fetch(`http://${IP}:${PORT}/api/v1/posts`, {
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
            // setUser(result.user);
            // setUsername(result.user);
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
  }, [user]);

  return (
    <>
      <Navbar logOut={logOut} page={"Home"} />
      <main className="sm:p-8 px-4 py-8 w-full bg-[#20B2AA] min-h-[calc(100vh-73px)]">
        <section className="w-full h-full mx-auto">
          <div>
            <h1 className="font-extrabold text-[#222328] text-center text-[34px]">
              Welcome {user && `${user},`} to Pixel Wizard AI!
            </h1>
            <p className="mt-2 text-[#222121] text-[14px] text-center font-semibold">
              Create, share, and explore incredible AI images generated through
              the power of DALL-E
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
                    <span className="text-[#434964] font-semibold">
                      {searchText}
                    </span>
                    :
                  </h2>
                )}

                {allPosts.length === 0 ? (
                  <h2 className="mt-5 text-center font-bold text-[#00008B] text-xl uppercase">
                    {user
                      ? "No posts found"
                      : "Sign in to view and create images"}
                  </h2>
                ) : (
                  <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
                    <RenderCards data={allPosts} username={user} />
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
