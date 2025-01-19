export default class HUDScene extends Phaser.Scene {
    constructor() {
        super('HUDScene');
    }

    create() {
        // Example HUD elements
        this.coinIcon = this.add.image(35, 550, 'coin');
        this.coinText = this.add.text(55, 545, '0', { color: '#fff' });
        
        // v basic nventory UI
        this.add.text(30, 510, 'INVENTORY', { color: '#fff' }); //header
        this.inventoryText = this.add.text(140, 545, '', { color: '#fff' }); //blank for now. can't display what you don't have!

        // Listen for registry data changes
        this.registry.events.on('changedata', (parent, key, value) => {
            if (key === 'coins') {
                this.coinText.setText(value);
            } else if (key === 'inventory') {
                this.updateInventoryDisplay(value);
            }
        });
    }

    updateInventoryDisplay(inventory) {
        // Filter out 'coins' from the inventory (they already have a display!)
        const filteredInventory = inventory.filter(item => item !== 'coins');
        this.inventoryText.setText('' + filteredInventory.join(', '));
    }
}