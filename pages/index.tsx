import axios from "axios";
import NoResults from "../components/NoResults";
import ImageCard from "../components/ImageCard";
import { Video } from "../types";

import { BASE_URL } from "../utils";

interface IProps {
  videos: Video[];
}

const Home = ({ videos }: IProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-8 gap-4 p-2">
      {videos.length ? (
        videos.map((video: Video) => <ImageCard post={video} key={video._id} />)
      ) : (
        <div className="col-span-3">
          <NoResults text={"まだ投稿がありません"} />
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = async ({
  query: { topic },
}: {
  query: { topic: string };
}) => {
  let response = null;
  if (topic) {
    response = await axios.get(`${BASE_URL}/api/discover/${topic}`);
  } else {
    response = await axios.get(`${BASE_URL}/api/post`);
  }

  return {
    props: {
      videos: response.data,
    },
  };
};

export default Home;
