import InputBox from "./InputBox";
import Posts from "./Posts";
import Stories from "./Stories";


function Feed({posts}) {
    return (
        <div className="flex-grow h-screen pb-44 pt-6 mr-2 xl:mr-8 overflow-y-auto scrollbar-hide">
            <div className="mx-auto max-w-full md:max-w-2xl lg:max-w-3xl">
                {/* Stories */}
                <Stories />
                {/* Input box */}
                <InputBox />
                {/* Post */}
                <Posts posts={posts} />
            </div>
        </div>
    );
}

export default Feed;
