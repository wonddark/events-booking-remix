import EmptyBox from "~/assets/EmptyBox";

function NoResults() {
  return (
    <section>
      <EmptyBox className="w-9/12 max-w-sm me-auto ms-auto mt-9" />
      <h3 className="text-2xl lg:text-4xl font-light mt-5 text-center">
        Sorry there is nothing to show here
      </h3>
    </section>
  );
}

export default NoResults;
