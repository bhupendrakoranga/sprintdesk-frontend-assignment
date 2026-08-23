import { Suspense } from "react";
import BoardPage from "../../features/board/BoardPage";

const Board = () => {
  return (
    <Suspense>
      <BoardPage />
    </Suspense>
  );
};

export default Board;