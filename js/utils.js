function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function getNodeByPath(path) {
    if (!path) return null;
    let current = appState.tree;
    for(let i of path) {
        current = current.children[i];
    }
    return current;
}

function buildTournamentTree(participants) {
    let root = { type: 'match', children: [{type:'leaf'}, {type:'leaf'}, {type:'leaf'}] };
    
    function getLeaves(node) {
        if(node.type === 'leaf') return [node];
        let res = [];
        for(let c of node.children) res = res.concat(getLeaves(c));
        return res;
    }

    let leaves = getLeaves(root);
    let queue = [...leaves]; 
    
    while(leaves.length < participants.length) {
        let leafToExpand = queue.shift();
        leafToExpand.type = 'match';
        leafToExpand.children = [{type:'leaf'}, {type:'leaf'}, {type:'leaf'}];
        queue.push(...leafToExpand.children);
        leaves = getLeaves(root); 
    }

    for(let i=0; i<leaves.length; i++) {
        if (participants[i]) {
            leaves[i].data = { ...participants[i] };
        } else {
            leaves[i].data = { name: t('error') };
        }
    }
    return root;
}