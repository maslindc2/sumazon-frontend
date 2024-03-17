/**
 * This function is responsible for finding a product's image with the associated product ID.
 * Since Product's and Images are stored in two different schemas we need a way to find the correct image
 * @param {*} productID - This is the product ID that we are currently trying to find an image for
 * @param {*} productImagesArray - This is the image array that contains all of the images in the image store
 * @returns - The base64 data string to display the image
 */
export function findImageInProductImages(productID, productImagesArray) {
    // Find the product id in the productImages array
    const imageEntry = productImagesArray.find(
        (productImage) => productImage.product_id === productID
    );
    // If the imageEntry has the field imag_data then return the image data if not return empty string
    return imageEntry ? imageEntry.image_data : "";
}
