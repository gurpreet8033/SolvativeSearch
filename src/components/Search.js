import React, { useCallback, useEffect, useMemo, useState } from "react";
import "../style.css";
import axios from "axios";
import debounce from "lodash.debounce";
import Spinner from "./Spinner";

function Search() {
  const [input, setInput] = useState("");
  const [data, setData] = useState({});
  const [pageCount, setPageCount] = useState(0);
  const [pageValue, setPageValue] = useState(1);
  const [limit, setLimit] = useState(5);
  const [paginationVal, setPaginationVal] = useState(1);
  const [isloading, setIsLoading] = useState(false);
  // useEffect(() => {
  //   console.log(data);
  //   setTimeout(() => {
  //     fetchData(data);
  //   }, 2000);

  // }, [data]);

  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key == "/") {
      document.getElementById("search-box").focus();
    }
  });

  const fetchData = useCallback((value) => {
    setIsLoading(true);
    // var axios = require("axios").default;
    if (value.length > 0) {
      var options = {
        method: "GET",
        url: "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
        params: { countryIds: "IN", namePrefix: value, limit: "10" },
        headers: {
          "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
          "x-rapidapi-key":
            "4ac5e3352fmshe6ac515ca3b8ccap1f0045jsnf0a504a87bbe",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          setData(response.data);
          setIsLoading(false);
          setPageCount(response.data.metadata.totalcount);
          setPaginationVal(response.data.metadata.totalcount / limit);
        })
        .catch(function (error) {
          console.error(error);
          setIsLoading(false);
        });
    }
  }, []);
  const handleChange = (e) => {
    console.log("g", e.target.value);
    setInput(e.target.value);
    debouncedChangeHandler(e.target.value);
  };
  const debouncedChangeHandler = useMemo(() => {
    return debounce(fetchData, 1200);
  }, [fetchData]);
  // const debouncedChangeHandler = useCallback(debounce(handleChange, 1000), []);
  const pagination = (e) => {};

  // function changePage(page) {
  //   var btn_next = document.getElementById("btn_next");
  //   var btn_prev = document.getElementById("btn_prev");
  //   var listing_table = document.getElementById("listingTable");
  //   var page_span = document.getElementById("page");

  //   // Validate page
  //   if (page < 1) page = 1;
  //   if (page > numPages()) page = numPages();

  //   listing_table.innerHTML = "";

  //   for (
  //     var i = (page - 1) * records_per_page;
  //     i < page * records_per_page;
  //     i++
  //   ) {
  //     listing_table.innerHTML += objJson[i].adName + "<br>";
  //   }
  //   page_span.innerHTML = page;

  //   if (page == 1) {
  //     btn_prev.style.visibility = "hidden";
  //   } else {
  //     btn_prev.style.visibility = "visible";
  //   }

  //   if (page == numPages()) {
  //     btn_next.style.visibility = "hidden";
  //   } else {
  //     btn_next.style.visibility = "visible";
  //   }
  // }
  // function prevPage() {
  //   if (current_page > 1) {
  //     current_page--;
  //     changePage(current_page);
  //   }
  // }

  // function nextPage() {
  //   if (current_page < numPages()) {
  //     current_page++;
  //     changePage(current_page);
  //   }
  // }

  return (
    <>
      <div className="search-container">
        <div className="input-box">
          <input
            value={input}
            id="search-box"
            className="search-box"
            type="text"
            placeholder="Search places..."
            onChange={handleChange}
          ></input>

          <span>Ctrl+/</span>
        </div>

        <table className="search-table">
          <tr>
            <th>#</th>
            <th>Place Name</th>
            <th>Country</th>
          </tr>
          {data?.data?.map((val, key) => {
            return (
              <tr key={key}>
                <td>{key + 1}</td>
                <td>{val.city}</td>
                <td>{val.country}</td>
              </tr>
            );
          })}
        </table>
        {isloading ? (
          <Spinner />
        ) : (
          <div className="show-info">
            {Object.keys(data).length == 0
              ? "Start searching..."
              : data?.data?.length == 0
              ? "No result found"
              : ""}
          </div>
        )}
        <div class="pagination">
          <a id="btn_prev" href="#">
            &laquo;
          </a>

          <a href="#" class="active">
            1
          </a>

          <a id="btn_next" href="#">
            &raquo;
          </a>
        </div>
      </div>
    </>
  );
}

export default Search;
