import { Button, Input, Modal } from "antd";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faComments,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { Database } from "../../database.types";

type Props = Readonly<{
  host: Database["public"]["Tables"]["profiles"]["Row"];
}>;

function BtnContactWithHost({ host }: Props) {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  return (
    <>
      <Button
        className="mx-auto block mt-2"
        icon={<FontAwesomeIcon icon={faComments} />}
        onClick={toggleModal}
      >
        Contact the host
      </Button>
      <Modal
        title={`Contact with ${host.first_name} ${host.last_name}`}
        footer={null}
        okText={null}
        cancelText={null}
        open={showModal}
        onCancel={toggleModal}
      >
        <Input.TextArea
          rows={7}
          maxLength={500}
          showCount
          placeholder="Write your message here. No more than 500 characters."
        />
        <div className="flex justify-end items-center gap-2 mt-5">
          <Button
            type="primary"
            onClick={toggleModal}
            icon={<FontAwesomeIcon icon={faPaperPlane} />}
          >
            Send
          </Button>
          <Button
            type="default"
            onClick={toggleModal}
            icon={<FontAwesomeIcon icon={faCircleXmark} />}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default BtnContactWithHost;
