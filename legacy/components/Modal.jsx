import ReactMarkdown from "react-markdown";
import { v4 as uuidv4 } from "uuid";
import { useModal } from "../contexts/ModalContext";
import { ReactComponent as XMark } from "../images/ui/xmark.svg";

export const Modal = () => {
  const { showModal, modalData, setShowModal } = useModal();
  const { title, text } = modalData;
  const haveInput = typeof modalData.inputs === "object";

  const Input = ({ input }) => {
    return (
      <li className="" key={uuidv4()}>
        {input.input.length > 1 ? (
          input.input
            .map((e) => (
              <span className="font-bold text-cyan-500" key={uuidv4()}>
                {e}
              </span>
            ))
            .map((e, i) => {
              return [e, i !== input.input.length - 1 ? " or " : ""];
            })
        ) : (
          <span className="font-bold text-cyan-500">
            {input.input.map((e) => e)}
          </span>
        )}{" "}
        → <span className="italic">{input.name}</span>
      </li>
    );
  };

  return (
    <div
      className={
        showModal
          ? "modal oapcity-100 visible absolute z-50 flex h-screen w-screen items-center justify-center bg-neutral-900/90 duration-200"
          : "modal invisible absolute z-50 flex h-screen w-screen items-center justify-center opacity-0 duration-200"
      }
    >
      <button
        onClick={() => setShowModal(false)}
        className="border-1 hover:shadow-cyan absolute right-0 top-0 box-content flex h-6 w-6 items-center justify-center rounded-xl p-5 duration-200  hover:text-cyan-500"
      >
        <XMark />
      </button>
      <div className="z-5 relative flex h-[80%] w-4/5 flex-col overflow-y-auto rounded-xl bg-neutral-800 p-8 shadow-2xl outline-neutral-900">
        <h1 className="mb-4 text-4xl font-bold">{title}</h1>
        <div className="flex flex-col gap-6">
          {text.map((e) => (
            <ReactMarkdown key={uuidv4()}>{e}</ReactMarkdown>
          ))}
          {haveInput ? (
            <ul className="flex flex-col gap-2">
              {modalData.inputs.map((list) => {
                return (
                  <>
                    <h3 className="mt-3 text-2xl font-bold">{list[0].name}</h3>
                    {list.map((input) => {
                      if (input.input.length === 0) return;
                      return <Input key={uuidv4()} input={input} />;
                    })}
                  </>
                );
              })}
            </ul>
          ) : (
            ""
          )}
        </div>
      </div>
      <div
        onClick={() => setShowModal(false)}
        className="absolute -z-10 h-screen w-screen bg-neutral-900/90"
      ></div>
    </div>
  );
};
