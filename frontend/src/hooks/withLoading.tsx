import { Spinner } from "@admiral-ds/react-ui";

type WithLoadingProps<T> = T & {
  loading: boolean;
};

export const withLoading = <T extends object>(Component: React.FC<T>) =>
  function useLoading(props?: WithLoadingProps<T>) {
    if (props?.loading) {
      return (
        <Spinner
          style={{
            width: 40,
            height: 40,
            margin: "auto",
          }}
        />
      );
    }

    return <Component {...(props as T)} />;
  };
