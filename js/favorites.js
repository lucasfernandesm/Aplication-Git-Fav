

import { GithubUsers } from "./githubUsers.js"

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.tbody = this.root.querySelector('table tbody')

        this.load()
    } 
    
    noFav() {
        const noFav = this.root.querySelector('.noFavorites')

        if(this.entries.length !== 0) {
            noFav.classList.add('hide')
        }
        else {
            noFav.classList.remove('hide')
        }
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    delete (user) {
        const fielteredEntries = this.entries.filter(entry => entry.login !== user.login)
        this.entries = fielteredEntries

        this.update()
        this.save()
    }

    async add(username) {
        try {
            const userExist = this.entries.find(entry => entry.login === username)

            if(userExist) {
                throw new Error('Usuário já consta na lista')
            }

            const user = await GithubUsers.search(username)
            if(user.login === undefined){
                throw new Error('Não encontramos esse usuário!')
            }
            
            this.entries = [user, ...this.entries]
            this.update()
            this.save()
        } catch(error) {
            alert(error.message)
        }
    }
}

export class FavoriteViews extends Favorites {
    constructor(root) {
        super(root)  
        this.update()  
        this.onAdd()    
    }  

    onAdd() {
        const addButton = this.root.querySelector('.search button')

        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
            search.value = ""
        }
    }

    update() {
        this.removeAllTr()
        this.entries.forEach((user) => {
            const row = this.createRow()
            
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = `${user.name}`
            row.querySelector('.user span').textContent = `/${user.login}`
            row.querySelector('.repositories').textContent = `${user.public_repos}`
            row.querySelector('.followers').textContent = `${user.followers}`
            row.querySelector('.remove').onclick = () => {
                const remove = confirm('Tem certeza que deseja remover esse usuário?')
                
                if(remove) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })
        
        this.noFav()
    }

    createRow() {
        const tr = document.createElement('tr')
        tr.innerHTML = 
                    `<td class="user">
                        <img src="https://github.com/LucasFernandesM.png" alt="Imagem de usuário">
                        <a href="https://github.com/LucasFernandesM" target="_blank">
                            <p>Lucas Fernandes</p>
                            <span>/LucasFernandesM</span>
                        </a>
                    </td>
                    <td class="repositories"> 10 </td>
                    <td class="followers"> 10 </td>
                    <td><button class="remove">Remover</button></td>`
        return tr
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        })
    }  
}