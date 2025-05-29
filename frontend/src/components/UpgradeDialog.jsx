import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const UpgradeDialog = ({ open, onClose, onUpgrade }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Upgrade to Premium</DialogTitle>
      <DialogContent>
        <Typography variant="body1" paragraph>
          You've reached the limit of 2 itineraries on the free plan.
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Create unlimited itineraries" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Access premium features" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Priority support" />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Not Now</Button>
        <Button variant="contained" color="primary" onClick={onUpgrade}>
          Upgrade Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpgradeDialog;
