import React, { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { useFetcher } from "@remix-run/react";
import { action as categoriesAction } from "~/routes/_content.categories/route";
import type { SelectProps } from "antd";
import { Select, Spin } from "antd";
import debounce from "lodash.debounce";

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

function DebounceSelect<
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
  } = any
>({
  fetchOptions,
  debounceTimeout = 800,
  ...props
}: Readonly<DebounceSelectProps<ValueType>>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout]);

  return (
    <Select
      labelInValue
      filterOption={false}
      showSearch
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
}

function CategorySelector({
  inputRef,
  defaultValue = "",
  id,
}: Readonly<{
  inputRef: RefObject<HTMLInputElement>;
  defaultValue?: string;
  id?: string;
}>) {
  const categories = useFetcher<typeof categoriesAction>();

  const newFetch = (query: string) => {
    const formData = new FormData();
    formData.append("category_name", query);
    return fetch(`${document.location.origin}/categories`, {
      method: "POST",
      body: formData,
    })
      .then(
        (res) =>
          res.json() as Promise<{
            data: { id: string; name: string }[];
            error: any;
          }>
      )
      .then((data) => {
        return data.data.map(({ id, name }) => ({
          value: id,
          label: name,
        }));
      });
  };

  useEffect(() => {
    const formData = new FormData();
    formData.append("category_name", defaultValue);
    categories.submit(formData, { action: "/categories", method: "POST" });
  }, [defaultValue]);

  return (
    <DebounceSelect
      loading={categories.state === "loading"}
      showSearch
      placeholder="Select category"
      className="w-full"
      filterOption={false}
      fetchOptions={newFetch}
      defaultValue={
        categories.data?.data
          ?.filter((item) => item.id === defaultValue)
          ?.map((item) => ({ value: item.id, label: item.name }))?.[0] ?? null
      }
      id={id}
      onChange={(e) => {
        inputRef.current!.value = (e as { value: string }).value;
      }}
      allowClear
    />
  );
}

export default CategorySelector;
