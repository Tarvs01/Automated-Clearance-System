export interface StaffData {
  dept: string | null;
  defaulters: {
    id: number;
    matricNumber: string;
    offences: { id: number; description: string; date: string }[];
  }[];
}

export interface DefaulterDetails {
  props: StaffData["defaulters"][0];
  updateState: React.Dispatch<React.SetStateAction<StaffData>>;
  openDefaulter: any;
}

export interface ContextDetails {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}
