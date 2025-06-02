import React from "react";
import IngredientList from "./IngredientList";
import AuthGuard from "../../components/AuthGuard";

const IngredientsPage: React.FC = () => {
  return (
    <AuthGuard requireAdmin={true}>
      <div>
        <IngredientList />
      </div>
    </AuthGuard>
  );
};

export default IngredientsPage;