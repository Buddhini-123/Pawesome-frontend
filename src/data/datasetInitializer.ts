import * as XLSX from 'xlsx';
import pawsomeDataset from './pawsomeDataset';
import { RawProductData } from '../services/productDataService';

/**
 * Initialize the Pawsome dataset from Excel file
 */
export class DatasetInitializer {
  private static isInitialized = false;

  /**
   * Initialize dataset from the products.xlsx file
   */
  public static async initializeFromExcel(): Promise<void> {
    if (this.isInitialized) {
      console.log('Dataset already initialized');
      return;
    }

    try {
      console.log('Starting dataset initialization...');
      
      // Read the Excel file
      const response = await window.fs.readFile('products.xlsx');
      const workbook = XLSX.read(response, {
        cellStyles: true,
        cellFormulas: true,
        cellDates: true,
        cellNF: true,
        sheetStubs: true
      });

      // Get the first sheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert to JSON
      const rawData: RawProductData[] = XLSX.utils.sheet_to_json(worksheet, { 
        defval: '' 
      });

      console.log(`Loaded ${rawData.length} products from Excel file`);

      // Clean and validate data
      const cleanedData = this.cleanRawData(rawData);
      console.log(`Cleaned data: ${cleanedData.length} valid products`);

      // Initialize the dataset
      await pawsomeDataset.loadFromExcelData(cleanedData);
      
      this.isInitialized = true;
      console.log('Dataset initialization completed successfully!');
      
      // Log statistics
      const stats = pawsomeDataset.getStatistics();
      console.log('Dataset Statistics:', stats);

    } catch (error) {
      console.error('Failed to initialize dataset:', error);
      throw error;
    }
  }

  /**
   * Clean and validate raw Excel data
   */
  private static cleanRawData(rawData: any[]): RawProductData[] {
    return rawData
      .filter(item => {
        // Filter out empty rows or invalid data
        return item.name && 
               item.name.trim().length > 0 && 
               item.unit_price && 
               !isNaN(Number(item.unit_price)) &&
               item.category_id &&
               item.brand_id &&
               item.current_stock !== undefined;
      })
      .map(item => ({
        name: String(item.name).trim(),
        description: String(item.description || ''),
        added_by: String(item.added_by || 'seller'),
        user_id: Number(item.user_id) || 0,
        category_id: Number(item.category_id),
        brand_id: Number(item.brand_id),
        video_provider: String(item.video_provider || ''),
        video_link: String(item.video_link || ''),
        unit_price: Number(item.unit_price),
        purchase_price: item.purchase_price && !isNaN(Number(item.purchase_price)) 
          ? Number(item.purchase_price) 
          : '',
        unit: String(item.unit || 'pc'),
        current_stock: Number(item.current_stock) || 0,
        est_shipping_days: Number(item.est_shipping_days) || 3,
        meta_title: String(item.meta_title || ''),
        meta_description: String(item.meta_description || '')
      }));
  }

  /**
   * Check if dataset is initialized
   */
  public static isDatasetInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Force re-initialization
   */
  public static async forceReInitialize(): Promise<void> {
    this.isInitialized = false;
    pawsomeDataset.reset();
    await this.initializeFromExcel();
  }
}

/**
 * Auto-initialize when this module is imported (for convenience)
 * This can be disabled by setting autoInit to false
 */
export const autoInitDataset = async (autoInit: boolean = true): Promise<void> => {
  if (autoInit && typeof window !== 'undefined' && window.fs) {
    try {
      await DatasetInitializer.initializeFromExcel();
    } catch (error) {
      console.warn('Auto-initialization failed:', error);
      console.warn('Dataset will need to be manually initialized');
    }
  }
};

// Export for manual initialization
export { DatasetInitializer as default };
