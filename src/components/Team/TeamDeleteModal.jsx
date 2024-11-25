import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { getTeamListById, updateTeam } from "../../Apis/team"
import { useRouter } from "next/router"

const TeamDeleteModel = ({
    isOpen,
    onOpen,
    setSnackMessage,
    setSnackOpen,
    setSnackSuccess,
    setUpdate,
    teamId,
    setTeamId,
    fromDash
  }) => {
    const accessToken = Cookies.get("accessToken")
    const router=useRouter()
    const [data, setData] = useState(null)
    const getTeamById = async () => {
      const res = await getTeamListById(teamId, accessToken)
      console.log(res)
      if (res) {
        setData(res?.userTeam)
      }
    }
    useEffect(() => {
      if (teamId) {
        getTeamById()
      }
    }, [teamId])
    const handleDelete = async () => {
      let body = {
        teamName: data?.name,
        file: data?.teamIcon,
        isActive: 0
      }
      const res = await updateTeam(body, teamId)
      if (res) {
        setUpdate((prev) => !prev);
        setSnackOpen(true);
        setSnackSuccess("success");
        setSnackMessage(`Team Delete SuccessFully`);
        onOpen(false);
        setTeamId("")
      } else {
        setSnackOpen(true);
        setSnackSuccess("warning");
        setSnackMessage(`Something Went Wrong`);
      }
      if(fromDash){
        router.push("/team")
      }
    }
  
    return (
      <Modal
        isOpen={isOpen}
        onClose={() => onOpen(false)}
        placement="top-center"
        radius="lg"
        classNames={{
          body: "mb-2 pb-2",
          backdrop: "bg-overlay/50 backdrop-opacity-40",
          base: "text-black w-[30%]",
          header: "pb-1",
          footer: "",
          closeButton: ""
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col justify-center">Delete Team</ModalHeader>
              <ModalBody className="">
                Are you sure want to delete this team?
              </ModalBody>
              <ModalFooter>
                <Button size="md" color="danger" variant="light" onClick={() => handleDelete()}>
                  Yes
                </Button>
                <Button size="md" className="bg-[#05686E] text-white" onPress={onClose}>
                  No
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    )
  }
  export default TeamDeleteModel