import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDropDownDataAPI } from "../../../api/user/campaign-api/targetingOptionService";

export const fetchDropdownData = createAsyncThunk(
  "dropdown/fetchDropdownData",
  async () => {
    const dropdownData = await getDropDownDataAPI();

    // Normalize the data for UI
    const productOptions = dropdownData.products.map((p) => ({
      label: p.name,
      value: p.id,
      price: p.price,
    }));

    const deviceOptions = dropdownData.devices.map((d) => ({
      label: d.name,
      value: d.id,
      price: d.price,
    }));

    const cityOptions = dropdownData.locations.map((loc) => ({
      label: loc.name,
      value: loc.id,
    }));

    const cityRegionMap = {};
    dropdownData.locations.forEach((loc) => {
      // Use numeric key to match city.value
      cityRegionMap[loc.id] = loc.regions.map((r) => ({
        label: r.name,
        value: r.id,
        postcode: r.postcode,
        cityName: loc.name,
      }));
    });

    return {
      raw: dropdownData,
      products: productOptions,
      devices: deviceOptions,
      cities: cityOptions,
      cityRegionMap,
    };
  }
);

const cityProductDevice = createSlice({
  name: "cityProductDevice",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearDropdownData: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDropdownData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDropdownData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDropdownData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearDropdownData } = cityProductDevice.actions;

export default cityProductDevice.reducer;


// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { getDropDownDataAPI } from "../../../api/user/campaign-api/targetingOptionService";

// export const fetchDropdownData = createAsyncThunk(
//   "dropdown/fetchDropdownData",
//   async () => {
//     const dropdownData = await getDropDownDataAPI();

//     // Normalize the data for UI
//     const productOptions = dropdownData.products.map((p) => ({
//       label: p.name,
//       value: p.id,
//       price: p.price,
//     }));

//     const deviceOptions = dropdownData.devices.map((d) => ({
//       label: d.name,
//       value: d.id,
//       price: d.price,
//     }));

//     const cityOptions = dropdownData.locations.map((loc) => ({
//       label: loc.name,
//       value: loc.id,
//     }));

//     const cityRegionMap = {};
//     dropdownData.locations.forEach((loc) => {
//       cityRegionMap[loc.id] = loc.regions.map((r) => ({
//         label: r.name,
//         value: r.id,
//         postcode: r.postcode,
//         cityName: loc.name,
//       }));
//     });

//     return {
//       raw: dropdownData, // keep original if needed
//       products: productOptions,
//       devices: deviceOptions,
//       cities: cityOptions,
//       cityRegionMap,
//     };
//   }
// );

// const cityProductDevice = createSlice({
//   name: "cityProductDevice",
//   initialState: {
//     data: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearDropdownData: (state) => {
//       state.data = null;
//       state.error = null;
//       state.loading = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchDropdownData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchDropdownData.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload;
//       })
//       .addCase(fetchDropdownData.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export const { clearDropdownData } = cityProductDevice.actions;

// export default cityProductDevice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { getDropDownDataAPI } from '../../../api/user/campaign-api/targetingOptionService';

// export const fetchDropdownData = createAsyncThunk(
//   'dropdown/fetchDropdownData',
//   async () => {
//     const dropdownData = await getDropDownDataAPI();
//     return dropdownData;  // { products, locations, devices }
//   }
// );

// const cityProductDevice = createSlice({
//   name: 'cityProductDevice',
//   initialState: {
//     data: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearDropdownData: (state) => {
//       state.data = null;
//       state.error = null;
//       state.loading = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchDropdownData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchDropdownData.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload; // payload is already dropdown data
//       })
//       .addCase(fetchDropdownData.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export const { clearDropdownData } = cityProductDevice.actions;

// export default cityProductDevice.reducer;
