<template>
  <div>
    <h1>Users</h1>
    <el-button type="primary" @click="handleAddNew">Add New</el-button>
    <el-button type="danger" @click="handleBulkDelete">Bulk Delete</el-button>
    <el-table :data="tableData">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="Name" sortable></el-table-column>
      <el-table-column prop="displayName" label="Display Name"></el-table-column>
      <el-table-column label="Actions">
        <template #default="{ row }">
          <el-button size="small" @click="handleView(row)">View</el-button>
          <el-button size="small" @click="handleEdit(row)">Edit</el-button>
          <el-button size="small" @click="handleDelete(row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "DataTable",
  data() {
    return {
      tableData: [
        { name: "Membership Admin", displayName: "Membership Admin" },
        // ... more data
      ],
    };
  },
  methods: {
    handleAddNew() {
      // Logic for adding a new entry
    },
    handleBulkDelete() {
      // Logic for bulk deletion
    },
    handleView(row) {
      // Logic for viewing details
    },
    handleEdit(row) {
      // Logic for editing an entry
    },
    handleDelete(row) {
      // Logic for deleting an entry
    },
  },
};
</script>
