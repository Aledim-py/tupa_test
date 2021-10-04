const domain = "http://127.0.0.1:8000"

export function createImage(image: ArrayBuffer, title: string) {
    console.log("Asking for creating a request: ");
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', new Blob([image], {type: "image/jpg"} ));
    const request = new XMLHttpRequest();
    request.open("POST", `${domain}/api/create-image`);
    request.send(formData);
    /* let response = fetch(`${domain}/api/create-image`, {
        method: "POST",
        body: formData,
    }); */

    return true;
}

export async function getImages() {
    let response = await fetch(`${domain}/api/get-images`, {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
    });

    return await response.json();
}

