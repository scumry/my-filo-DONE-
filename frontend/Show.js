const allFiles = document.querySelector('.ShowFiles')


async function MainFilesUser() {

    let checkId = await fetch(`http://localhost:8000/id/${token}`, {
        method: 'GET',
    })
    const contentId = await checkId.json();

    contentId.map(async a => {
        let allinfo = await fetch(`http://localhost:8000/files/id/allinfo/${a.id}`, {
            method: 'GET',
        })
        const allContentAllInfoFile = await allinfo.json();


        let IdMassive = []
        for (i = 0; i < allContentAllInfoFile.length; i++) {

            IdMassive.push(allContentAllInfoFile[i]['id'])

        }
        console.log(IdMassive)

        for (i = 0; i < allContentAllInfoFile.length; i++) {
            let allInfoOtId = await fetch(`http://localhost:8000/files/id/allinfo/id/${IdMassive[i]}`, {
                method: 'GET',
            })
            const ContentallInfoOtId = await allInfoOtId.json();



            ContentallInfoOtId.map(a => {

                allFiles.innerHTML +=
                    `
                    <div class="files-user" id="${a.id}">
                    <div>
                        <span>${a.file_name}</span>
                        <span>${a.file_format}</span>
                        <button id="${a.id}" class="download-btn-count">Скачать файл</button>
                    </div>
                </div>
             `




            });

            document.addEventListener('click', async function (e) {



                let targetElement = e.target;

                let current = targetElement.id;

                console.log(current)
              

          

                let checkPath = await fetch(`http://localhost:8000/files/id/allinfo/id/${current}`, {
                    method: 'GET',
                })
                const contentPath = await checkPath.json();
                 

                contentPath.map(a => {

                    
                    
                    document.getElementById(`${current}`).addEventListener("click", function () {
                        window.location.href = `/${a.file_path}`;
                    });
                })
            })


        }
    })
}




MainFilesUser()