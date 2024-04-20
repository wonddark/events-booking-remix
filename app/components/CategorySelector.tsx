import { RefObject, useRef, useState } from "react";
import { useFetcher } from "@remix-run/react";
import { action as categoriesAction } from "~/routes/_content.categories/route";

function CategorySelector({
  inputRef,
  defaultValue = "",
}: Readonly<{
  inputRef: RefObject<HTMLInputElement>;
  defaultValue?: string;
}>) {
  const categories = useFetcher<typeof categoriesAction>();
  const selectCategoryRef = useRef<HTMLInputElement>(null);
  const [showCombo, setShowCombo] = useState(false);
  const toggleCombo = () => {
    setShowCombo((prev) => !prev);
  };

  return (
    <categories.Form action="/categories" method="POST">
      <div className="w-full relative">
        <label htmlFor="event_category" className="text-primary-950">
          Category{" "}
          <input
            type="text"
            name="category_name"
            id="event_category"
            placeholder="Category name"
            required={false}
            className={`rounded-lg py-1.5 px-3.5 w-full`}
            ref={selectCategoryRef}
            onChange={(event) => {
              categories.submit(event.target.form);
              toggleCombo();
            }}
            defaultValue={defaultValue}
          />
        </label>
        <div
          className={`mt-1 rounded-lg border shadow-md z-10 absolute top-full left-0 right-0 bg-white${
            showCombo ? " block" : " hidden"
          }`}
        >
          <ul className="flex flex-col p-0 m-0">
            {categories.data?.data && categories.data.data.length > 0 ? (
              <>
                {categories.data?.data?.map((category) => (
                  <li
                    key={category.id}
                    className="rounded-lg py-1.5 px-3.5 w-full hover:bg-gray-50"
                  >
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => {
                        selectCategoryRef.current &&
                          (selectCategoryRef.current.value = category.name);
                        inputRef.current &&
                          (inputRef.current.value = category.id);
                        toggleCombo();
                      }}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </>
            ) : (
              <li className="rounded-lg py-1.5 px-3.5 w-full hover:bg-gray-50 cursor-pointer">
                <span>Nothing found</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </categories.Form>
  );
}

export default CategorySelector;
