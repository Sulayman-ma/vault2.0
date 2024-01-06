import { 
  Button, 
  Card, 
  Dialog, 
  DialogBody, 
  DialogFooter, 
  DialogHeader, 
  Typography 
} from "@material-tailwind/react";
import { useState, useContext } from "react";
import { Web5Context } from "@/app/lib/contexts";
import { deleteRecord } from "@/app/lib/crud";
import clsx from "clsx";

export default function ListBeneficiaries({ 
  beneficiaries, 
  setAlertInfo 
}) {
  // WEB5 CONTEXT
  const { web5 } = useContext(Web5Context)

  // COMPONENT STATES
  const [removeData, setRemoveData] = useState({
    benName: '',
    recordId: ''
  });
  const [openDialog, setOpenDialog] = useState(false);

  // CLICK ACTION HANDLERS
  const handleRemove = (benName, recordId) => {
    setRemoveData({
      benName: benName,
      recordId: recordId,
    })
    setOpenDialog(true)
  }

  const removeBeneficiary = async () => {
    try {
      // close dialog before removing beneficiary
      setOpenDialog(false)
      await deleteRecord(web5, removeData.recordId)
      setAlertInfo({
        open: true,
        color: 'green',
        content: 'Beneficiary removed'
      })
    } catch (error) {
      setAlertInfo({
        open: true,
        color: 'red',
        content: error
      })
    }
  };

  const TABLE_HEAD = ['Name', 'DID', 'Relationship', '']

  return (
    <Card color="transparent" className="h-full overflow-y-auto">
      <table className="m-auto w-[20rem] md:w-80% table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className={clsx(
                  "border-b border-white-100 bg-white-50 p-4",
                  {
                    // hide DID on mobile because I hate the scroll
                    'hidden md:table-cell' : head === 'DID'
                  }
                )}
              >
                <Typography
                  variant="paragraph"
                  color="white"
                  className="font-semibold leading-none opacity-70"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {beneficiaries.map(({ recordId, name, relationship, did }) => {
            const classes = "p-4 border-b border-white-50";
 
            return (
              <tr key={recordId}>
                <td className={classes}>
                  <Typography
                    variant="paragraph"
                    color="white"
                    className="font-semibold"
                  >
                    {name}
                  </Typography>
                </td>
                <td className={`hidden md:table-cell ${classes}`}>
                  <Typography
                    variant="paragraph"
                    color="white"
                    className="font-semibold"
                  >
                    {did ? (did.substring(0, 20) + '...') : 'No DID'}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="paragraph"
                    color="white"
                    className="font-semibold"
                  >
                    {relationship}
                  </Typography>
                </td>
                <td className={classes}>
                  <Button
                    variant="gradient"
                    color="red"
                    className="font-medium"
                    onClick={() => {handleRemove(name, recordId)}}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* CONFIRM REMOVE BENEFICIARY DIALOG */}
      <Dialog open={openDialog} handler={() => setOpenDialog(!openDialog)}>
        <DialogHeader color="red">Remove Beneficiary</DialogHeader>
        <DialogBody>
          Are you sure you want to remove {removeData.benName} from list?
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="black"
            onClick={() => setOpenDialog(false)}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={removeBeneficiary}
          >
            Remove
          </Button>
        </DialogFooter>
      </Dialog>
    </Card>
  )
}
