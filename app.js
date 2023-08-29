const grid = document.querySelector('.grid')
const input = document.getElementById('input')
const submitBtn = document.getElementById('submit')
//responsive using macy instance
const macyInstance = Macy({
	container: grid,
	breakAt: {
		1600: 5,
		1200: 4,
		900: 3,
		600: 2,
		400: 1,
	},
	margin: {
		x: 15,
		y: 15,
	},
})
//API key mention
//b-uBREKv14x3_IgCP8SR3TzOtZGnkPkuwCeDn0bOgm0
const key = 'b-uBREKv14x3_IgCP8SR3TzOtZGnkPkuwCeDn0bOgm0'

const API_URL = 'https://api.unsplash.com'
const fixStartUpBug = () => {
	macyInstance.runOnImageLoad(function () {
		macyInstance.recalculate(true, true)
		var evt = document.createEvent('UIEvents')
		evt.initUIEvent('resize', true, false, window, 0)
		window.dispatchEvent(evt)
	}, true)
}

const addImagesInDom = images => {
	images.forEach(image => {
		const container = document.createElement('div')

		const img = document.createElement('img')

		img.src = image
		container.append(img)

		grid.append(container)
	})
}

const intializeImages = async () => {
	let { data: images } = await axios.get(
		`${API_URL}/photos/?client_id=${key}&per_page=300`
	)

	images = images.map(image => image.urls.regular)

	addImagesInDom(images)

	fixStartUpBug()
}

intializeImages()

const searchImages = async query => {
	let {
		data: { results: images },
	} = await axios.get(
		`${API_URL}/search/photos/?client_id=${key}&query=${query}&per_page=100`
	)

	images = images.map(image => image.urls.regular)

	return images
}


const removeAllChild = parent => {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild)
	}
}

const handleSubmit = async event => {
	event.preventDefault()
//refresh for new search
	const query = input.value

	if (!query) return false

	const images = await searchImages(query)

	removeAllChild(grid)

	addImagesInDom(images)

	fixStartUpBug()
}

submitBtn.addEventListener('click', handleSubmit)


import axios from "axios";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "./style.css";

function App() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("code");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const client_id = "b-uBREKv14x3_IgCP8SR3TzOtZGnkPkuwCeDn0bOgm0";
  const fetchUrl = `https://api.unsplash.com/search/photos?client_id=${client_id}&query=${query}&page=${page}`;

  const fetchImages = () => {
    axios
      .get(fetchUrl, {
        headers: {},
      })
      .then((response) => {
        setData([...data, ...response.data.results]);
      })
      .catch((error) => {
        console.log(error);
      });
    setPage(page + 1);
  };
  const searchImages = (e) => {
    if (e.keyCode === 13) {
      setQuery(e.target.value);
      setData([]);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [query]);

  return (
    <div className="App flex">
      <input
        type="text"
        onKeyDown={(e) => searchImages(e)}
        placeholder="Search For Images 🔎"
      />
      <InfiniteScroll
        dataLength={data.length}
        next={fetchImages}
        hasMore={hasMore}
        loader={<p>Load more...</p>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <div className="main flex">
          {data.map((data, key) => (
            <div className="container" key={key}>
              <img
                src={data.urls.small}
                className="image"
                alt={data.alt_description}
              />
              <h4>Photo by {data.user.name} 📸</h4>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default App;