import { List, TaskBar } from "@react95/core";
import { HelpBook } from "@react95/icons";
import { useState } from "react";
import ToolModal from "./ToolModal";
import About from "../tools/About/About";

export default function DesktopBar() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const closeAbout = () => setIsAboutOpen(false);

  return (
    <>
      {isAboutOpen && <ToolModal isOpen={isAboutOpen} id='about' title='About this tool' content={<About />} onClose={closeAbout}></ToolModal>}
      <TaskBar list=
        {<List>
          <List.Item icon={<HelpBook variant="16x16_4" />} onClick={() => setIsAboutOpen(true)}>
            About this tool
          </List.Item>
        </List>}
        />
    </>
  );
}