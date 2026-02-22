import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRequests } from "@/hooks/use-requests";
import { Category } from "@/models/Category";
import { AdminTable, Column } from "./AdminTable";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { EditCategoryModal } from "./EditCategoryModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { CreateCategoryModal } from "./CreateCategoryModal";
import { toast } from "sonner";
import { BooleanLabel } from "../shared/BooleanLabel";


export function CategoryList() {
  const api = useRequests();

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["categories", "global"],
    queryFn: () => api.getCategories('global'),
  });

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const handleSave = async (id: string, data: any) => {
    try {
      // In Admin/CategoryList, we are always in Global mode.
      // We update the Category entity directly.
      await api.updateCategory(id, {
        name: data.name,
        colorHex: data.colorHex,
        isInvestment: data.isInvestment,
        ignored: data.ignored
      });

      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Categoria global atualizada com sucesso!");
    } catch (error) {
      console.error("Failed to update category:", error);
      toast.error("Erro ao atualizar categoria.");
    } finally {
      setEditingCategory(null);
    }
  };

  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (category: Category) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    try {
      await api.deleteCategory(deletingCategory.id);
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria excluída", {
        description: "A categoria foi excluída com sucesso.",
      });
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("Erro ao excluir categoria. Verifique se existem registros vinculados.");
    } finally {
      setIsDeleting(false);
      setDeletingCategory(null);
    }
  };

  const columns: Column<Category>[] = [
    {
      header: "ID",
      className: "w-[100px]",
      cellClassName: "font-mono text-xs text-muted-foreground",
      cell: (category) => <>{category.id.slice(0, 8)}...</>,
    },
    {
      header: "Nome",
      accessorKey: "name",
      className: "w-[420px]",
      cellClassName: "font-medium text-foreground",
      cell: (category) => <CategoryBadge category={category} />
    },
    {
      header: "Investimento",
      accessorKey: "isInvestment",
      className: "w-[120px] text-center",
      cellClassName: "text-center",
      cell: (category) => <BooleanLabel check={category.isInvestment} />
    },
    {
      header: "Ignorado",
      accessorKey: "ignored",
      className: "w-[120px] text-center",
      cellClassName: "text-center",
      cell: (category) => <BooleanLabel check={category.ignored} />
    },
  ];

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <AdminTable
        title="Selecione categoria para alterar"
        description={isLoading ? "Carregando..." : `${categories.length} categorias encontradas`}
        addButtonLabel="Adicionar Categoria"
        columns={columns}
        data={categories}
        isLoading={isLoading}
        onAdd={() => setIsCreateModalOpen(true)}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage="Nenhuma categoria encontrada."
      />

      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditCategoryModal
        category={editingCategory}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        mode="admin"
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title={`Excluir ${deletingCategory?.name}?`}
        description="Esta ação não pode ser desfeita. Isso excluirá permanentemente a categoria e pode afetar os registros vinculados."
      />
    </>
  );
}
