import { getAllFiles } from '../../src/utils/zutils';
import fs from 'fs';
import path from 'path';

// Mocking fs and path modules
jest.mock('fs');
jest.mock('path');

describe('getAllFiles', () => {
    it('should return all files from a directory', () => {
        const mockFiles = ['file1.txt', 'file2.txt', 'dir1'];
        const mockFilePaths = ['path/to/dir/file1.txt', 'path/to/dir/file2.txt'];
        fs.readdirSync.mockReturnValue(mockFiles);
        fs.statSync.mockImplementation((filepath) => {
            return { isDirectory: () => filepath.includes('dir') };
        });
        path.join.mockImplementation((...args) => args.join('/'));

        const result = getAllFiles('path/to/dir');
        expect(result).toEqual(mockFilePaths);
        expect(fs.readdirSync).toHaveBeenCalledWith('path/to/dir');
        expect(fs.statSync).toHaveBeenCalledTimes(mockFiles.length);
        expect(path.join).toHaveBeenCalled();
    });
});